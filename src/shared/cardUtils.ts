import {Card, Rank, Suit} from "./Card";

export function isSameCard(c1: Card, c2: Card) {
    return c1.suit === c2.suit && c1.rank === c2.rank
}

export function isWeli(card: Card) {
    return card.rank === Rank.Six && card.suit === Suit.Bells
}
