import {Card} from "./Card";

export type Trick = {
    playerId: string
    card: Card
}[];

export interface Player {
    name: string
    id: string
    cards: Card[]
    tricksWon: number
}

export interface Opponent {
    name: string
    id: string
    nCards: number
    tricksWon: number
}

export interface PlayerGameState {
    id: string
    player: Player
    opponents: Opponent[]
    trick: Trick
}
