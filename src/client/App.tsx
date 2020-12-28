import React, {Component} from "react";
import {Game, GameProps} from "./Game";
import {v4 as uuid} from 'uuid';
import {MainMenu} from "./MainMenu";

export enum AppPhase {
    Menu,
    Game
}

interface AppProps {
}

interface AppState {
    phase: AppPhase
    gameId: string
    playerName: string
    ready: boolean
}

const playerNameKey = 'schnoin.playerName';

export class App extends Component<AppProps, AppState> {
    constructor(props: GameProps) {
        super(props)
        const url = new URL(document.location.href)
        this.state = {
            phase: AppPhase.Menu,
            gameId: url.searchParams.get('game-id') || uuid().substring(0, 13),
            playerName: localStorage.getItem(playerNameKey) || '',
            ready: false
        }

        this.onGameIdChanged = this.onGameIdChanged.bind(this)
        this.onPlayerNameChanged = this.onPlayerNameChanged.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.refreshGameId = this.refreshGameId.bind(this)
    }

    render() {
        if (this.state.phase === AppPhase.Menu) {
            return <MainMenu
                gameId={this.state.gameId}
                playerName={this.state.playerName}
                onGameIdChanged={this.onGameIdChanged}
                onPlayerNameChanged={this.onPlayerNameChanged}
                onJoin={this.joinGame}
                onRefreshGameId={this.refreshGameId}
            />
        } else {
            return <Game
                id={this.state.gameId}
                ready={this.state.ready}
                onReady={() => this.ready()}
            />
        }
    }

    private onGameIdChanged(gameId: string) {
        this.setState({gameId})
    }

    private onPlayerNameChanged(playerName: string) {
        this.setState({playerName})
    }

    private refreshGameId() {
        this.setState({
            gameId: uuid().substring(0, 13)
        })
    }

    private joinGame() {
        if (this.state.playerName.length === 0) {
            console.error('invalid player name')
            return
        }
        if (this.state.gameId.length === 0) {
            console.error('invalid game ID')
            return
        }

        try {
            localStorage.setItem(playerNameKey, this.state.playerName)
        } catch(e) {
            console.warn(e)
        }

        registerForGame(this.state.gameId, this.state.playerName)
            .then(() => {
                const url = new URL(window.location.href)
                url.searchParams.set('game-id', this.state.gameId)
                history.replaceState({}, '', url.toString())
                this.setState({phase: AppPhase.Game});
            })
            .catch(console.error)
    }

    private ready() {
        markAsReady(this.state.gameId)
            .then(() => this.setState({ready: true}))
            .catch(console.error)
    }
}

function registerForGame(gameId: string, playerName: string) {
    return fetch(`/api/game/${gameId}/register`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: playerName
        })
    })
}

function markAsReady(gameId: string) {
    return fetch(`/api/game/${gameId}/ready`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

