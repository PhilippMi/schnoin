import React, {Component} from "react";
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Round} from "./Round";
import {Card} from "../shared/Card";

export interface GameProps {
    id: string,
    token: string
}

interface GameState {
    stateHistory: PlayerGameState[],
    stateIndex: number,
}

export class Game extends Component<GameProps, GameState> {
    private interval: number | undefined

    constructor(props: GameProps) {
        super(props);
        this.state = {
            stateHistory: [],
            stateIndex: -1,
        }
    }

    async componentDidMount() {
        this.processToEnd().catch(console.error)
        this.interval = window.setInterval(() => this.process(), 1000)
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }

    private async process() {
        await this.fetchUpdates();
        if (this.state.stateIndex + 1 < this.state.stateHistory.length) {
            this.setState((prevState) => ({
                stateIndex: prevState.stateIndex + 1
            }))
        }
    }

    private async processToEnd() {
        await this.fetchUpdates();
        this.setState((prevState) => ({
            stateIndex: prevState.stateHistory.length - 1
        }))
    }

    private async fetchUpdates() {
        let endpoint = `/api/game/${this.props.id}/updates`;
        const stateHistory = this.state.stateHistory;
        if (stateHistory.length > 0) {
            endpoint += `/${stateHistory[stateHistory.length - 1].id}`
        }
        endpoint += `?token=${this.props.token}`

        const response = await fetch(endpoint)
        const updates: PlayerGameState[] = await response.json()
        if (updates.length > 0) {
            this.setState((prevState) => ({
                stateHistory: prevState.stateHistory.concat(updates)
            }))
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
        if (this.state.stateIndex === -1) {
            return null
        }
        let currentState = this.state.stateHistory[this.state.stateIndex];
        return <Round state={currentState} onSelectCard={(c) => this.selectCard(c)}/>
    }
}
