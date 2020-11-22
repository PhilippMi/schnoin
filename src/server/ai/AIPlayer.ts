import {GameModel, Player} from "../GameModel";
import {eventBus} from "../eventBus";
import {getCurrentTrick, getStateForPlayer} from "../gameUtils";
import {registerPlayer} from "../GameManagement";
import {v4 as uuid} from 'uuid';
import {getCardsAllowedToBePlayed, playCard} from "../GameLogic";
import {Trick} from "../../shared/PlayerGameSate";
import {EventType} from "../../shared/Event";

let playerIndex = 1;

export class AIPlayer {
    private readonly player: Player

    constructor(private readonly game: GameModel) {
        this.player = registerPlayer(game, uuid(), `AI ${playerIndex++}`)
        eventBus.register(game, EventType.CardPlayed, () => this.onUpdate())
        eventBus.register(game, EventType.NewTrick, () => this.onUpdate())
    }

    onUpdate() {
        let currentTrick = getCurrentTrick(this.game);
        if (currentTrick?.currentPlayerId === this.player.id) {
            playCard(this.game, this.player.id, this.randomCard(currentTrick))
        }
    }

    randomCard(currentTrick: Trick) {
        const playerState = getStateForPlayer(this.player, this.game.stateHistory[0])
        const allowedCards = getCardsAllowedToBePlayed(playerState.cards, currentTrick, this.game.trumpSuit)
        return allowedCards[Math.floor(Math.random() * allowedCards.length)]
    }

}


