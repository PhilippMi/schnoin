import {Card, Suit} from "./Card";

export interface PlayerGameState {
    gamePhase: GamePhase
    id: string
    player: User
    opponents: (Opponent | null)[]
    round?: Round,
    lastEventId: string | null
}

export enum GamePhase {
    Created,
    Started,
    Finished
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


export interface Round {
    phase: RoundPhase
    bets: Bet[]
    trumpSuit?: Suit
    trick?: Trick
}

export enum RoundPhase {
    Betting,
    Play
}

export interface Bet {
    playerId: string
    value: number | null
}

export interface Trick {
    currentPlayerId: string | null
    cards: {
        playerId: string
        card: Card
    }[]
}
