import {Deck} from "./Deck";
import {Card, Suit} from "../shared/Card";

type Trick = {
    playerId: string
    card: Card
}[];

export enum GamePhase {
    Created,
    Started,
    Finished
}

export interface Player {
    id: string
    name: string
    token: string
}

export interface GameModel {
    id: string
    deck: Deck
    players: Player[]
    trumpSuit: Suit
    stateHistory: GameState[],
    phase: GamePhase
}

export interface PlayerState {
    id: string
    cards: Card[]
    tricksWon: number
}

export interface GameState {
    id: string
    trick: Trick;
    playerState: PlayerState[]
}
