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
    index: number
    tricksWon: number
    ready: boolean
}

export interface User extends Player {
    cards: Card[]
}

export interface Opponent extends Player {
    nCards: number
}

export enum GamePhase {
    Created,
    Started,
    Finished
}

export interface PlayerGameState {
    gamePhase: GamePhase
    id: string
    player: User
    opponents: (Opponent | null)[]
    trick: Trick,
    lastEventId: string | null
}
