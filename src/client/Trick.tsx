import './trick.scss';
import {Trick} from "../shared/PlayerGameSate";
import React from "react";
import {CardView} from "./CardView";

export interface TrickProps {
    trick: Trick
}

export function Trick(props: TrickProps) {
    const cardItems = props.trick.cards.map(({card}) => (
        <div className="trick__card" key={`${card.suit}.${card.rank}`}>
            <CardView card={card} />
        </div>
    ))
    return <div className="trick">
        {cardItems}
    </div>
}
