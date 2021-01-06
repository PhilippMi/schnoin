import {GameModel} from "../GameModel";
import {Card} from "../../shared/Card";
import {GamePhase, RoundPhase} from "../../shared/PlayerGameState";
import {UserError} from "../UserError";
import {getPlayerByToken} from "../gameUtils";
import {isSameCard} from "../../shared/cardUtils";
import assert from "assert";
import {nHandCards} from "../../shared/constants";
import {eventBus} from "../eventBus";
import {EventType} from "../../shared/Event";
import {getNextPlayer} from "./getNextPlayer";

export function buyCards(game: GameModel, playerToken: string, cardsToExchange: Card[]) {
    if (game.phase !== GamePhase.Started) {
        throw new UserError('Game has not yet started or is already finished')
    }
    if (!game.round || game.round.phase !== RoundPhase.Buying) {
        throw new UserError('Round is not in the "Buying" phase')
    }

    const player = getPlayerByToken(game, playerToken);

    if (game.round.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    if (![0, 1, 2, 3, 5].includes(cardsToExchange.length)) {
        throw new UserError('Can only buy 0, 1, 2, 3 or 5 new cards')
    }

    if (!cardsToExchange.every(c1 => player.cards.some(c2 => isSameCard(c1, c2)))) {
        throw new UserError('Can only exchange cards the user owns')
    }

    const cardsInDeck = game.round.deck.size;
    if (cardsInDeck < cardsToExchange.length) {
        throw new UserError(`Not enough cards remain in the deck to exchange ${cardsToExchange.length} cards. Cards in deck: ${cardsInDeck}`)
    }

    player.cards = player.cards.filter(c1 => !cardsToExchange.some(c2 => isSameCard(c1, c2)))

    assert(player.cards.length + cardsToExchange.length === nHandCards)


    player.cards.push(... game.round.deck.popCards(cardsToExchange.length))
    game.round.cardsExchanged.push({
        playerId: player.id,
        nCards: cardsToExchange.length
    })

    const nextPlayerId = getNextPlayer(player, game).id;
    game.round.currentPlayerId = nextPlayerId

    eventBus.trigger(game, {
        eventType: EventType.CardsBought,
        payload: {
            playerId: player.id,
            nCards: cardsToExchange.length,
            nextPlayerId: nextPlayerId
        }
    })

    const wasLastPlayer = game.round.cardsExchanged.length >= game.players.length;
    if (wasLastPlayer) {
        finishBuying(game)
    }

}

function finishBuying(game: GameModel) {
    assert(game.round)

    game.round.phase = RoundPhase.Play
    eventBus.trigger(game, {
        eventType: EventType.BuyingEnd,
        payload: {}
    })

    game.round.trick = {
        cards: []
    }
    eventBus.trigger(game, {
        eventType: EventType.NewTrick,
        payload: { startPlayerId: game.round.currentPlayerId }
    })
}
