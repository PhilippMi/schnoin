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
    Created='Created',
    Started='Started',
    Finished='Finished'
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
    currentPlayerId: string | null
    bets: Bet[]
    trumpSuit?: Suit
    trick?: Trick
}

export enum RoundPhase {
    Betting='Betting',
    Play='Play'
}

export interface Bet {
    playerId: string
    value: number | null
}

export interface Trick {
    cards: {
        playerId: string
        card: Card
    }[]
}
