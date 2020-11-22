import React, {Component} from "react";
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Round} from "./Round";
import {Card} from "../shared/Card";
import {Event} from "../shared/Event";
import {processEvent} from "./processEvent";

export interface GameProps {
    id: string,
    token: string
}

interface GameState {
    state: PlayerGameState | undefined,
    eventsToProcess: Event[]
}

export class Game extends Component<GameProps, GameState> {
    private interval: number | undefined

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
        window.clearInterval(this.interval)
    }

    private async fetchState() {
        const endpoint = `/api/game/${this.props.id}?token=${this.props.token}`;

        const response = await fetch(endpoint)
        const state: PlayerGameState = await response.json()
        this.setState({
            state
        }, () => {
            this.interval = window.setInterval(() => this.process(), 1000)
        })
    }

    private async process() {
        await this.fetchUpdates();
        const nextEvent = this.state.eventsToProcess[0];
        if (nextEvent) {
            this.setState((prevState) => {
                if (!prevState.state) {
                    return prevState
                }
                return {
                    eventsToProcess: prevState.eventsToProcess.slice(1),
                    state: updateState(prevState.state, nextEvent)
                }
            })
        }
    }

    private async fetchUpdates() {
        if (!this.state.state) {
            return
        }

        const endpoint = `/api/game/${this.props.id}/events/${this.state.state.lastEventId}?token=${this.props.token}`
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
            body: JSON.stringify(card)
        })
            .then(() => this.process())
            .catch(console.error)
    }

    render() {
        if (!this.state.state) {
            return null
        }
        return <Round state={this.state.state} onSelectCard={(c) => this.selectCard(c)}/>
    }
}


function updateState(state: PlayerGameState, event: Event): PlayerGameState {
    const newState = JSON.parse(JSON.stringify(state))
    processEvent(newState, event)
    return newState
}
