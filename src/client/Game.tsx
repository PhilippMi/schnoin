import React, {Component} from "react";
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Round} from "./Round";
import { v4 as uuid } from "uuid";

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

    render() {
        if (!this.state.state) {
            return null
        }
        return <Round state={this.state.state}/>
    }
}
