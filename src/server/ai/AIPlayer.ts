import {GameModel, Player} from "../GameModel";
import {eventBus} from "../eventBus";
import {registerPlayer} from "../GameManagement";
import {v4 as uuid} from 'uuid';
import {playCard} from "../logic/playCard";
import {EventType} from "../../shared/Event";
import {getCardsAllowedToBePlayed} from "../logic/cardsAllowedToPlay";
import assert from "assert";
import {getHighestBet, placeBet} from "../logic/placeBet";
import {Suit} from "../../shared/Card";
import {RoundPhase} from "../../shared/PlayerGameState";

let playerIndex = 1;

export class AIPlayer {
    private readonly player: Player

    constructor(private readonly game: GameModel) {
        eventBus.register(game, EventType.NewRound, () => this.onPlaceBet())
        eventBus.register(game, EventType.BetPlaced, () => this.onPlaceBet())
        eventBus.register(game, EventType.CardPlayed, () => this.onPlayCard())
        eventBus.register(game, EventType.NewTrick, () => this.onPlayCard())
        eventBus.register(game, EventType.NewTrick, () => this.onPlayCard())
        this.player = registerPlayer(game, uuid(), `AI ${playerIndex++}`)
    }

    private onPlaceBet() {
        if (this.isMyTurn()) {
            assert(this.game.round)
            assert(this.game.round.phase === RoundPhase.Betting)
            const cardsOfSuit: Record<Suit, number> = {
                [Suit.Leaves]: 0,
                [Suit.Bells]: 0,
                [Suit.Hearts]: 0,
                [Suit.Acorns]: 0
            }
            this.player.cards.forEach(c => cardsOfSuit[c.suit]++)

            const nCards = Object.values(cardsOfSuit)

            let betValue: null | number = null;
            if(nCards.some(n => n === 5)) {
                betValue = 4
            } else if(nCards.some(n => n === 4)) {
                betValue = 3
            } else if(nCards.some(n => n === 3)) {
                betValue = 2
            }


            if(betValue && betValue <= (getHighestBet(this.game.round.bets)?.value || 0)) {
                betValue = null
            }
            placeBet(this.game, this.player.token, betValue)
        }
    }

    private onPlayCard() {
        if (this.isMyTurn()) {
            playCard(this.game, this.player.token, this.randomCard())
        }
    }

    private isMyTurn() {
        return this.game.round?.currentPlayerId === this.player.id;
    }

    private randomCard() {
        assert(this.game.round)
        assert(this.game.round.trumpSuit !== undefined)
        assert(this.game.round.trick)
        const allowedCards = getCardsAllowedToBePlayed(this.player.cards, this.game.round.trick, this.game.round.trumpSuit)
        return allowedCards[Math.floor(Math.random() * allowedCards.length)]
    }

}


