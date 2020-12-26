import {Deck} from "./Deck";
import {Card, Suit} from "../shared/Card";
import {Trick, GamePhase} from "../shared/PlayerGameState";

export interface Player {
    id: string
    name: string
    token: string
    cards: Card[]
    tricksWon: number
    ready: boolean;
}

export interface GameModel {
    id: string
    deck: Deck
    players: Player[]
    trumpSuit: Suit
    trick: Trick;
    phase: GamePhase
}
