import {Deck} from "./Deck";
import {Card, Suit} from "../shared/Card";
import {Bet, GamePhase, RoundPhase, Trick} from "../shared/PlayerGameState";

export interface PlayerModel {
    id: string
    name: string
    token: string
    cards: Card[]
    tricksWon: number
    ready: boolean
}

export interface RoundModel {
    deck: Deck
    phase: RoundPhase
    currentPlayerId: string | null
    bets: Bet[]
    trumpSuit?: Suit
    trick?: Trick
}

export interface GameModel {
    id: string
    players: PlayerModel[]
    startPlayerIndex: number
    round?: RoundModel
    phase: GamePhase
}
