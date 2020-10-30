import "./round.scss"
import {PlayerGameState} from "../shared/PlayerGameSate";
import React from "react";
import {CardView} from "./CardView";

interface RoundProps {
    state: PlayerGameState
}

export function Round(props: RoundProps) {
    const cardItems = props.state.myCards.map(c =>
        <div className="round__card" key={`${c.suit}.${c.rank}`}>
            <CardView card={c}/>
        </div>
    )
    return <div className="round">
        <div className="round__my-hand">
            {cardItems}
        </div>
    </div>
}
