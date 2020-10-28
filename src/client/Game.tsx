import "./game.scss"
import {PlayerGameState} from "../shared/PlayerGameSate";
import React from "react";
import {CardView} from "./CardView";

interface GameProps {
    state: PlayerGameState
}

export function Game(props: GameProps) {
    const cardItems = props.state.myCards.map(c =>
        <CardView card={c} key={`${c.suit}.${c.rank}`}></CardView>
    )
    return <div className="game">
        <div className="game__my-hand">
            {cardItems}
        </div>
    </div>
}
