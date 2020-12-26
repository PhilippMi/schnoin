import './hidden-hand.scss';
import React from "react";
import {HiddenCard} from "./HiddenCard";

interface HiddenHandProps {
    nCards: number
    rotated?: boolean
}

export function HiddenHand(props: HiddenHandProps) {
    const cards = Array(props.nCards).fill(null).map((v, i) => (
        <div className={'hidden-hand__card'} key={i}>
            <HiddenCard rotated={!!props.rotated}/>
        </div>
    ))
    return <div className={`hidden-hand ${props.rotated ? 'hidden-hand--rotated' : ''}`}>
        {cards}
    </div>
}
