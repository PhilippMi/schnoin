import React, {Component} from "react";
import {Game, GameProps} from "./Game";
import {v4 as uuid} from 'uuid';
import {MainMenu} from "./MainMenu";
import {getPlayerToken} from "./getPlayerToken";

export enum AppPhase {
    Menu,
    Lobby,
    Game
}

interface AppProps {
}

interface AppState {
    phase: AppPhase
    gameId: string,
    playerName: string
}

export class App extends Component<AppProps, AppState> {
    constructor(props: GameProps) {
        super(props)
        const url = new URL(document.location.href)
        this.state = {
            phase: AppPhase.Menu,
            gameId: url.searchParams.get('game-id') || uuid().substring(0, 13),
            playerName: ''
        }

        this.onGameIdChanged = this.onGameIdChanged.bind(this)
        this.onPlayerNameChanged = this.onPlayerNameChanged.bind(this)
        this.joinGame = this.joinGame.bind(this)
    }

    render() {
        if (this.state.phase === AppPhase.Menu) {
            return <MainMenu
                gameId={this.state.gameId}
                playerName={this.state.playerName}
                onGameIdChanged={this.onGameIdChanged}
                onPlayerNameChanged={this.onPlayerNameChanged}
                onJoin={this.joinGame}
            />
        } else {
            return <Game
                id={this.state.gameId}
                token={getPlayerToken()}
                phase={this.state.phase}
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

    private joinGame() {
        if (this.state.playerName.length === 0) {
            console.error('invalid player name')
            return
        }
        if (this.state.gameId.length === 0) {
            console.error('invalid game ID')
            return
        }

        registerForGame(this.state.gameId, this.state.playerName)
            .then(() => this.setState({phase: AppPhase.Lobby}))
            .catch(console.error)
    }

    private ready() {
        startGame(this.state.gameId)
            .then(() => this.setState({phase: AppPhase.Game}))
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
            token: getPlayerToken(),
            name: playerName
        })
    })
}

function startGame(gameId: string) {
    return fetch(`/api/game/${gameId}/start`, { method: "POST" })
}

