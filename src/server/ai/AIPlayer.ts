import {GameModel, Player} from "../GameModel";
import {eventBus} from "../eventBus";
import {registerPlayer} from "../GameManagement";
import {v4 as uuid} from 'uuid';
import {playCard} from "../logic/playCard";
import {EventType} from "../../shared/Event";
import {getCardsAllowedToBePlayed} from "../logic/cardsAllowedToPlay";
import assert from "assert";

let playerIndex = 1;

export class AIPlayer {
    private readonly player: Player

    constructor(private readonly game: GameModel) {
        eventBus.register(game, EventType.CardPlayed, () => this.onUpdate())
        eventBus.register(game, EventType.NewTrick, () => this.onUpdate())
        this.player = registerPlayer(game, uuid(), `AI ${playerIndex++}`)
    }

    onUpdate() {
        if (this.game.round?.trick?.currentPlayerId === this.player.id) {
            playCard(this.game, this.player.token, this.randomCard())
        }
    }

    private randomCard() {
        assert(this.game.round)
        assert(this.game.round.trumpSuit !== undefined)
        assert(this.game.round.trick)
        const allowedCards = getCardsAllowedToBePlayed(this.player.cards, this.game.round.trick, this.game.round.trumpSuit)
        return allowedCards[Math.floor(Math.random() * allowedCards.length)]
    }

}


