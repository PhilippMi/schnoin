import React, {Component} from "react";
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Round} from "./Round";

export interface GameProps {
}

interface GameState {
    state: PlayerGameState | null
}

export class Game extends Component<GameProps, GameState> {
    private interval: number | undefined

    constructor(props: GameProps) {
        super(props);
        this.state = {
            state: null
        }
    }

    componentDidMount() {
        this.fetchState().catch(console.error);
        this.interval = window.setInterval(() => this.fetchState(), 1000)
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }

    private async fetchState() {
        const response = await fetch('/api/state')
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
