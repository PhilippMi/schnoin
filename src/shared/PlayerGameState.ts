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
    ready: boolean
}

export interface Opponent {
    name: string
    id: string
    nCards: number
    tricksWon: number
    ready: boolean
}

export enum GamePhase {
    Created,
    Started,
    Finished
}

export interface PlayerGameState {
    gamePhase: GamePhase
    id: string
    player: Player
    opponents: Opponent[]
    trick: Trick,
    lastEventId: string | null
}
