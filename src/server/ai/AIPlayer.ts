import {GameModel, PlayerModel} from "../GameModel";
import {eventBus} from "../eventBus";
import {registerPlayer} from "../GameManagement";
import {v4 as uuid} from 'uuid';
import {playCard} from "../logic/playCard";
import {EventType} from "../../shared/Event";
import {getCardsAllowedToBePlayed} from "../logic/cardsAllowedToPlay";
import assert from "assert";
import {getHighestBet, placeBet} from "../logic/placeBet";
import {Card, Rank, Suit} from "../../shared/Card";
import {RoundPhase, Trick} from "../../shared/PlayerGameState";
import {chooseTrumpSuit} from "../logic/chooseTrumpSuit";
import {isWeli} from "../../shared/cardUtils";
import {buyCards} from "../logic/buyCards";
import {getHighestCardValue, getInitialSuit, sortCardsByValueAndRank} from "../logic/cardValues";

let playerIndex = 1;

export class AIPlayer {
    private readonly player: PlayerModel

    constructor(private readonly game: GameModel) {
        eventBus.register(game, EventType.NewRound, callDefedred(() => this.onPlaceBet()))
        eventBus.register(game, EventType.BetPlaced, callDefedred(() => this.onPlaceBet()))
        eventBus.register(game, EventType.BettingEnd, callDefedred(() => this.onChooseTrumpSuit()))
        eventBus.register(game, EventType.TrumpSuitChosen, callDefedred(() => this.onBuyCards()))
        eventBus.register(game, EventType.CardsBought, callDefedred(() => this.onBuyCards()))
        eventBus.register(game, EventType.CardPlayed, callDefedred(() => this.onPlayCard()))
        eventBus.register(game, EventType.NewTrick, callDefedred(() => this.onPlayCard()))
        eventBus.register(game, EventType.NewTrick, callDefedred(() => this.onPlayCard()))
        this.player = registerPlayer(game, uuid(), `AI ${playerIndex++}`)
    }

    private onPlaceBet() {
        if (this.isMyTurn() && this.game.round?.phase === RoundPhase.Betting && this.game.round.bets.every(b => b.playerId !== this.player.id)) {
            const bestSuit = this.getBestSuit()

            let betValue: null | number = null;
            if(bestSuit.count === 5) {
                betValue = 4
            } else if(bestSuit.count === 4) {
                betValue = 3
            } else if(bestSuit.count === 3) {
                betValue = 2
            }


            if(betValue && betValue <= (getHighestBet(this.game.round.bets)?.value || 0)) {
                betValue = null
            }
            placeBet(this.game, this.player.token, betValue)
        }
    }

    private onChooseTrumpSuit() {
        if (this.isMyTurn() && this.game.round?.phase === RoundPhase.Betting) {
            const bestSuit = this.getBestSuit()
            chooseTrumpSuit(this.game, this.player.token, bestSuit.suit)
        }
    }

    private onBuyCards() {
        if (this.isMyTurn() && this.game.round?.phase === RoundPhase.Buying) {
            assert(typeof this.game.round.trumpSuit === 'number')
            const trumpSuit = this.game.round.trumpSuit
            const cardsNotTrumpSuitOrDeuce = this.player.cards.filter(c =>
                !isWeli(c) &&
                c.suit !== trumpSuit &&
                c.rank !== Rank.Deuce
            )
            if (cardsNotTrumpSuitOrDeuce.length === 4) {
                cardsNotTrumpSuitOrDeuce.splice(0, 1)
            }
            if (this.game.round.deck.size < cardsNotTrumpSuitOrDeuce.length) {
                cardsNotTrumpSuitOrDeuce.splice(0, cardsNotTrumpSuitOrDeuce.length - this.game.round.deck.size)
            }
            buyCards(this.game, this.player.token, cardsNotTrumpSuitOrDeuce)
        }
    }

    private onPlayCard() {
        if (this.isMyTurn() && this.game.round?.phase === RoundPhase.Play) {
            assert(this.game.round)
            const trumpSuit = this.game.round.trumpSuit;
            assert(trumpSuit !== undefined)
            const trick = this.game.round.trick;
            assert(trick)

            const card = this.getBestCardToPlay(trick, trumpSuit);
            playCard(this.game, this.player.token, card)
        }
    }

    private getBestCardToPlay(trick: Trick, trumpSuit: Suit): Card {
        const allowedCards = getCardsAllowedToBePlayed(this.player.cards, trick, trumpSuit)

        if (trick.cards.length === 0) {
            return randomCard(allowedCards)
        }

        const initialSuit: Suit = getInitialSuit(trick, trumpSuit)
        const highestTrickValue = getHighestCardValue(trick.cards, initialSuit, trumpSuit)?.value
        const sortedAllowedCards = sortCardsByValueAndRank(allowedCards, initialSuit, trumpSuit)

        const highestHandValue = sortedAllowedCards[0].value;
        if (typeof highestTrickValue === 'number' && highestHandValue <= highestTrickValue) {
            const cardWithLeastValue = sortedAllowedCards[sortedAllowedCards.length - 1].card;
            return cardWithLeastValue
        } else {
            return randomCard(allowedCards)
        }
    }

    private isMyTurn() {
        return this.game.round?.currentPlayerId === this.player.id;
    }

    private getBestSuit() {
        const cardsOfSuit: Map<Suit, number> = new Map()
        this.player.cards.forEach(c => {
            let count = cardsOfSuit.get(c.suit)
            if (!count) {
                count = 0
            }
            count++
            cardsOfSuit.set(c.suit, count)
        })

        let bestSuit = { suit: Suit.Leaves, count: 0 }
        cardsOfSuit.forEach((suit, count) => {
            if (count > bestSuit.count) {
                bestSuit = {suit, count}
            }
        })
        return bestSuit
    }

}

function randomCard(allowedCards: Card[]) {
    return allowedCards[Math.floor(Math.random() * allowedCards.length)]
}

function callDefedred(cb: () => void) {
    return () => setTimeout(() => {
        try {
            cb();
        } catch(e) {
            console.error(e)
        }
    }, 0);
}
