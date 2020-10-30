import {Deck} from "./Deck";
import {Card} from "../shared/Card";

export interface GameModel {
    id: string
    deck: Deck
    players: {
        name: string
        cards: Card[]
        tricksWon: number
    }[]
}
