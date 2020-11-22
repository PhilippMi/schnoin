import './trick.scss';
import {Player, Trick} from "../shared/PlayerGameSate";
import React from "react";
import {CardView} from "./CardView";
import {Card} from "../shared/Card";

export interface TrickProps {
    playerIds: string[]
    trick: Trick
}

export function Trick(props: TrickProps) {
    const cardItems = props.playerIds.map((id) => {
        const trickIndex = props.trick.cards.findIndex(c => c.playerId === id)
        let card: Card | undefined
        if (trickIndex !== -1) {
            card = props.trick.cards[trickIndex].card
        }
        return (
            <div className="trick__card" key={`${id}`} style={({zIndex: trickIndex})}>
                {card &&
                    <CardView card={card}/>
                }
            </div>
        );
    })
    return <div className="trick">
        {cardItems}
    </div>
}
