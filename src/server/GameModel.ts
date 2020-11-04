import {Deck} from "./Deck";
import {Card} from "../shared/Card";

type Trick = {
    playerId: string
    card: Card
}[];

export interface Player {
    id: string
    name: string
    // todo token
}

export interface GameModel {
    id: string
    deck: Deck
    players: Player[]
    stateHistory: GameState[]
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
