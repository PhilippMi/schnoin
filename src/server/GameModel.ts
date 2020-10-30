import {Deck} from "./Deck";
import {Card} from "../shared/Card";

type Trick = {
    playerId: string
    card: Card
}[];

export interface GameModel {
    id: string
    deck: Deck
    players: {
        id: string
        name: string
        // todo token
    }[]
    stateHistory: GameState[]
}

export interface GameState {
    id: string
    trick: Trick;
    playerState: {
        id: string
        cards: Card[]
        tricksWon: number
    }[]
}
