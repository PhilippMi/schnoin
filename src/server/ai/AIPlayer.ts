import {GameModel, Player} from "../GameModel";
import {eventBus} from "../eventBus";
import {registerPlayer} from "../GameManagement";
import {v4 as uuid} from 'uuid';
import {playCard} from "../logic/playCard";
import {EventType} from "../../shared/Event";
import {getCardsAllowedToBePlayed} from "../logic/cardsAllowedToPlay";

let playerIndex = 1;

export class AIPlayer {
    private readonly player: Player

    constructor(private readonly game: GameModel) {
        eventBus.register(game, EventType.CardPlayed, () => this.onUpdate())
        eventBus.register(game, EventType.NewTrick, () => this.onUpdate())
        this.player = registerPlayer(game, uuid(), `AI ${playerIndex++}`)
    }

    onUpdate() {
        if (this.game.trick.currentPlayerId === this.player.id) {
            playCard(this.game, this.player.token, this.randomCard())
        }
    }

    randomCard() {
        const allowedCards = getCardsAllowedToBePlayed(this.player.cards, this.game.trick, this.game.trumpSuit)
        return allowedCards[Math.floor(Math.random() * allowedCards.length)]
    }

}


