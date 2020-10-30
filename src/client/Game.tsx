import React, {Component} from "react";
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Round} from "./Round";
import { v4 as uuid } from "uuid";
import {Card} from "../shared/Card";

export interface GameProps {
}

interface GameState {
    state: PlayerGameState | null,
    id: string
}

export class Game extends Component<GameProps, GameState> {
    private interval: number | undefined

    constructor(props: GameProps) {
        super(props);
        this.state = {
            state: null,
            id: uuid()
        }
    }

    componentDidMount() {
        this.fetchState().catch(console.error);
        this.interval = window.setInterval(() => this.fetchState(), 5000)
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }

    private async fetchState() {
        const response = await fetch(`/api/game/${this.state.id}/state`)
        const state: PlayerGameState = await response.json()
        this.setState({state})
    }

    private selectCard(card: Card) {
        fetch(`/api/game/${this.state.id}/trick`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(card)
        })
            .then(() => this.fetchState())
            .catch(console.error)
    }

    render() {
        if (!this.state.state) {
            return null
        }
        return <Round state={this.state.state} onSelectCard={(c) => this.selectCard(c)}/>
    }
}
