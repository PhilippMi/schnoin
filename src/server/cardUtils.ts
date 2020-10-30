import {Card, Rank, Suit} from "../shared/Card";


export function isWeli(card: Card) {
   return card.rank === Rank.Six && card.suit === Suit.Bells
}
