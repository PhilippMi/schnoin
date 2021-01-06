import './player-hand.scss';
import {CardView} from "./CardView";
import React from "react";
import {Card} from "../shared/Card";

interface PlayerHandProps {
    cards: Card[]
    selectedCards: Set<Card>
    onSelectCard: (card: Card) => void
}

export default function PlayerHand(props: PlayerHandProps) {
    return <div className="player-hand">
        {props.cards.map(c => {
            const selected = props.selectedCards.has(c)
            return <button className={`player-hand__card ${selected ? 'player-hand__card--selected' : ''}`} key={`${c.suit}.${c.rank}`} onClick={() => props.onSelectCard(c)}>
                <CardView card={c}/>
            </button>;
        })}
    </div>
}
