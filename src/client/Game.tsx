import './game.scss';

import React, {Component} from "react";
import {GamePhase, PlayerGameState, RoundPhase} from "../shared/PlayerGameState";
import {Table} from "./Table";
import {Card, Suit} from "../shared/Card";
import {Event} from "../shared/Event";
import {fetchGameState, processEvent} from "./processEvent";
import {ActionOverlay} from "./ActionOverlay";
import {assert} from "./assert";

export interface GameProps {
    id: string
    ready: boolean
    onReady: () => void
}

interface GameState {
    state: PlayerGameState | undefined,
    eventsToProcess: Event[]
    selectedCards: Set<Card>
}

export class Game extends Component<GameProps, GameState> {
    private updateInterval: number | undefined
    private processInterval: number | undefined
    private waiting: boolean = false

    constructor(props: GameProps) {
        super(props);
        this.state = {
            state: undefined,
            selectedCards: new Set(),
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
        if (!this.state.state || this.state.state.round?.currentPlayerId !== this.state.state.player.id) {
            console.error('It is not your turn yet')
            return
        }

        switch(this.state.state.round.phase) {
            case RoundPhase.Buying:
                this.setState(prevState => {
                    const newSelectedCards = new Set(Array.from(prevState.selectedCards))
                    if (prevState.selectedCards.has(card)) {
                        newSelectedCards.delete(card)
                    } else {
                        newSelectedCards.add(card)
                    }
                    return {
                        selectedCards: newSelectedCards
                    }
                })
                break
            case RoundPhase.Play:
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
                break
            default:
                console.warn(`Round is not in a phase to select cards: ${this.state.state.round.phase}`)
        }


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

    private chooseTrumpSuit(suit: Suit) {
        fetch(`/api/game/${this.props.id}/trump-suit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                suit
            })
        })
            .then(() => this.process())
            .catch(console.error)
    }

    private buyCards() {
        fetch(`/api/game/${this.props.id}/buy`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cards: Array.from(this.state.selectedCards)
            })
        })
            .then(response => response.json())
            .then(({newCards}) => {
                assert(this.state.state)
                return this.state.state.player.cards = newCards;
            })
            .catch(console.error)
    }

    render() {
        if (!this.state.state) {
            return null
        }
        const isLobby = this.state.state.gamePhase === GamePhase.Created;
        return (
            <div className={`game ${isLobby ? 'game--lobby' : ''}`}>
                <Table
                    state={this.state.state}
                    selectedCards={this.state.selectedCards}
                    onSelectCard={(c) => this.selectCard(c)}
                />
                {this.renderActionOverlay()}
            </div>
        )
    }

    private renderActionOverlay() {
        assert(this.state.state)
        return <ActionOverlay
            game={this.state.state}
            ready={this.props.ready}
            onReady={this.props.onReady}
            nSelectedCards={this.state.selectedCards.size}
            buyCards={() => this.buyCards()}
            placeBet={value => this.placeBet(value)}
            chooseTrumpSuit={suit => this.chooseTrumpSuit(suit)}
        />
    }
}


async function updateState(state: PlayerGameState, event: Event): Promise<{newState: PlayerGameState, delay: number}> {
    const newState = JSON.parse(JSON.stringify(state))
    const delay = await processEvent(newState, event)
    return {newState, delay}
}
