import "./card.scss";
import {Card, Rank, Suit} from "../shared/Card";
import React from "react";

export interface CardViewProps {
    card: Card
}

const suitCoordinatesMap: Record<Suit, number> = {
    [Suit.Hearts]: 0,
    [Suit.Bells]: 1,
    [Suit.Leaves]: 2,
    [Suit.Acorns]: 3
}

const rankCoordinatesMap: Record<Rank, number> = {
    [Rank.Deuce]: 0,
    [Rank.King]: 1,
    [Rank.Over]: 2,
    [Rank.Under]: 3,
    [Rank.Ten]: 4,
    [Rank.Nine]: 5,
    [Rank.Eight]: 6,
    [Rank.Seven]: 7,
    [Rank.Six]: 8
}

export function CardView(props: CardViewProps) {
    const style = {
        backgroundPositionY: `-${suitCoordinatesMap[props.card.suit]}00%`,
        backgroundPositionX: `-${rankCoordinatesMap[props.card.rank]}00%`
    };
    return <div role="image" className="card" style={style}/>
}
