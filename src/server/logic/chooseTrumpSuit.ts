import {GameModel} from "../GameModel";
import {Suit} from "../../shared/Card";
import {GamePhase, RoundPhase} from "../../shared/PlayerGameState";
import {UserError} from "../UserError";
import {getPlayerByToken} from "../gameUtils";
import {eventBus} from "../eventBus";
import {EventType} from "../../shared/Event";


export function chooseTrumpSuit(game: GameModel, playerToken: string, trumpSuit: Suit) {
    if (game.phase !== GamePhase.Started) {
        throw new UserError('Game has not yet started or is already finished')
    }
    if (!game.round || game.round.phase !== RoundPhase.Betting || game.round.bets.length !== game.players.length) {
        throw new UserError('Round is not in the right phase')
    }
    if (trumpSuit === undefined || trumpSuit === null) {
        throw new UserError('No trump suit given')
    }

    const player = getPlayerByToken(game, playerToken);

    if (game.round.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    game.round.trumpSuit = trumpSuit
    game.round.phase = RoundPhase.Play
    eventBus.trigger(game, {
        eventType: EventType.TrumpSuitChosen,
        payload: {
            trumpSuit
        }
    })

    game.round.trick = {
        cards: []
    }
    eventBus.trigger(game, {
        eventType: EventType.NewTrick,
        payload: { startPlayerId: game.round.currentPlayerId }
    })
}
