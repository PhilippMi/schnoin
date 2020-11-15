import "./index.scss";
import React from 'react'
import ReactDOM from 'react-dom'
import {Game} from "./Game"
import {v4 as uuid} from 'uuid';


window.addEventListener('load', () => {
    const token = uuid()
    const gameId = uuid()
    registerForGame(gameId, token)
        .then(() => startGame(gameId))
        .then(() => {
            ReactDOM.render(
                <Game id={gameId} token={token}/>,
                document.getElementById('root'),
            )
        })
        .catch(console.error)
})

function registerForGame(gameId: string, token: string) {
    return fetch(`/api/game/${gameId}/register`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token,
            name: 'Player One'
        })
    })
}

function startGame(gameId: string) {
    return fetch(`/api/game/${gameId}/start`, { method: "POST" })
}
