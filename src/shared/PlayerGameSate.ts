import {Card} from "./Card";

export interface Trick {
    currentPlayerId: string | null;
    cards: {
        playerId: string
        card: Card
    }[]
}

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
    trick: Trick,
    lastEventId: string | null
}
