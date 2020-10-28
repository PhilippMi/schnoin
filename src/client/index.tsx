import "./index.scss";
import React from 'react'
import ReactDOM from 'react-dom'
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Rank, Suit} from "../shared/Card";
import {Game} from "./Game"

const state: PlayerGameState = {
    myCards: [{
        rank: Rank.Deuce,
        suit: Suit.Hearts
    }, {
        rank: Rank.King,
        suit: Suit.Acorns
    }, {
        rank: Rank.Six,
        suit: Suit.Bells
    }, {
        rank: Rank.Eight,
        suit: Suit.Leaves
    }, {
        rank: Rank.Seven,
        suit: Suit.Acorns
    }]
}

window.addEventListener('load', () => {
    ReactDOM.render(
        <Game state={state}/>,
        document.getElementById('root'),
    )
})
