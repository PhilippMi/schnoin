import {Deck} from "./Deck";
import {Card} from "../shared/Card";
import {GamePhase, Round} from "../shared/PlayerGameState";

export interface Player {
    id: string
    name: string
    token: string
    cards: Card[]
    tricksWon: number
    ready: boolean
}

export interface GameModel {
    id: string
    deck: Deck
    players: Player[]
    round?: Round
    phase: GamePhase
}
