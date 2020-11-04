import './hidden-hand.scss';
import React from "react";
import {HiddenCard} from "./HiddenCard";

interface HiddenHandProps {
    nCards: number
}

export function HiddenHand(props: HiddenHandProps) {
    const cards = Array(props.nCards).fill(null).map(() => (
        <HiddenCard />
    ))
    return <div className="hidden-hand">
        {cards}
    </div>
}
