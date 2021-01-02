import './game.scss';

import React, {Component} from "react";
import {GamePhase, PlayerGameState, RoundPhase} from "../shared/PlayerGameState";
import {Table} from "./Table";
import {Card} from "../shared/Card";
import {Event} from "../shared/Event";
import {fetchGameState, processEvent} from "./processEvent";
import {assert} from "./assert";

export interface GameProps {
    id: string
    ready: boolean
    onReady: () => void
}

interface GameState {
    state: PlayerGameState | undefined,
    eventsToProcess: Event[]
}

export class Game extends Component<GameProps, GameState> {
    private updateInterval: number | undefined
    private processInterval: number | undefined
    private waiting: boolean = false

    constructor(props: GameProps) {
        super(props);
        this.state = {
            state: undefined,
            eventsToProcess: []
        }
    }

    async componentDidMount() {
        this.fetchState()
    }

    componentWillUnmount() {
        window.clearInterval(this.updateInterval)
        window.clearInterval(this.processInterval)
    }

    private async fetchState() {
        const state: PlayerGameState = await fetchGameState(this.props.id)
        this.setState({
            state
        }, () => {
            this.updateInterval = window.setInterval(() => this.fetchUpdates(), 250)
            this.processInterval = window.setInterval(() => this.process(), 30)
        })
    }

    private async process() {
        if (this.waiting) {
            return
        }
        const nextEvent = this.state.eventsToProcess[0];
        if (nextEvent && this.state.state) {
            const eventsToProcess = this.state.eventsToProcess;
            const {newState, delay} = await updateState(this.state.state, nextEvent)
            if (delay > 0) {
                this.waiting = true
                setTimeout(() => this.waiting = false, delay)
            }
            this.setState({
                eventsToProcess: eventsToProcess.slice(1),
                state: newState
            })
        }
    }

    private async fetchUpdates() {
        if (!this.state.state) {
            return
        }

        const endpoint = `/api/game/${this.props.id}/events/${this.state.state.lastEventId}`
        const response = await fetch(endpoint)
        const events: Event[] = await response.json()
        if (events.length > 0) {
            this.setState((prevState) => {
                const newState: PlayerGameState = JSON.parse(JSON.stringify(prevState.state))
                newState.lastEventId = events[events.length - 1].id
                return {
                    state: newState,
                    eventsToProcess: prevState.eventsToProcess.concat(events)
                }
            })
        }
    }

    private selectCard(card: Card) {
        fetch(`/api/game/${this.props.id}/trick`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                card: card
            })
        })
            .then(() => this.process())
            .catch(console.error)
    }

    private placeBet(value: number | null) {
        fetch(`/api/game/${this.props.id}/bet`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value
            })
        })
            .then(() => this.process())
            .catch(console.error)
    }

    render() {
        if (!this.state.state) {
            return null
        }
        const isLobby = this.state.state.gamePhase === GamePhase.Created;
        return (
            <div className={`game ${isLobby ? 'game--lobby' : ''}`}>
                <Table state={this.state.state} onSelectCard={(c) => this.selectCard(c)}/>
                {this.renderActionOverlay()}
            </div>
        )
    }

    private renderActionOverlay() {
        const game = this.state.state;
        const isLobby = game?.gamePhase === GamePhase.Created;
        const awaitingBet = game?.round?.phase === RoundPhase.Betting && game.round.currentPlayerId === game.player.id;

        const showOverlay = isLobby || awaitingBet
        if (!showOverlay) {
            return null
        }

        let buttons: {label: string; onClick: () => void}[]
        if (isLobby) {
            buttons = [{
                label: 'Ready',
                onClick: () => this.props.onReady()
            }]
        } else if (awaitingBet) {
            buttons = []
            for(let i = 0; i <= 5; i++) {
                buttons.push({
                    label: i.toString(),
                    onClick: () => this.placeBet(i === 0 ? null : i)
                })
            }
        } else {
            assert(false)
        }

        return <div className="game__action-overlay">
            {buttons.map(b =>
                <div className="game__button" key={b.label}>
                    <button onClick={b.onClick}>{b.label}</button>
                </div>
            )}
        </div>
    }
}


async function updateState(state: PlayerGameState, event: Event): Promise<{newState: PlayerGameState, delay: number}> {
    const newState = JSON.parse(JSON.stringify(state))
    const delay = await processEvent(newState, event)
    return {newState, delay}
}
