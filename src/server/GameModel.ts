import {Deck} from "./Deck";
import {Card, Suit} from "../shared/Card";
import {Trick} from "../shared/PlayerGameSate";

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
    trick: Trick;
    playerState: PlayerState[]
    phase: GamePhase
}

export interface PlayerState {
    id: string
    cards: Card[]
    tricksWon: number
}
