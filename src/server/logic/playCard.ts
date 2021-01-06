import {GameModel, PlayerModel} from "../GameModel"
import {Card, Suit} from "../../shared/Card"
import {UserError} from "../UserError"
import {GamePhase, Round, RoundPhase, Trick} from "../../shared/PlayerGameState";
import {eventBus} from "../eventBus";
import {EventType} from "../../shared/Event";
import {isSameCard} from "../../shared/cardUtils";
import {getPlayerById, getPlayerByToken} from "../gameUtils";
import {getHighestCardValue} from "./cardValues";
import {getCardsAllowedToBePlayed} from "./cardsAllowedToPlay";
import assert from "assert";
import {getNextPlayer} from "./getNextPlayer";
import {startAnotherRound} from "../GameManagement";

export function playCard(game: GameModel, playerToken: string, card: Card) {
    if (game.phase !== GamePhase.Started) {
        throw new UserError('Game has not yet started or is already finished')
    }

    const currentTrick = game.round?.trick
    if (!game.round || game.round.phase !== RoundPhase.Play || !currentTrick) {
        throw new UserError('Round has not yet started or is already finished')
    }

    const player = getPlayerByToken(game, playerToken);

    if (game.round.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    ensureCardAllowed(card, player, game.round, currentTrick);

    player.cards = player.cards.filter(c => !isSameCard(c, card))
    const newCardsInTrick = currentTrick.cards.concat([{
        playerId: player.id,
        card
    }]);
    const wasLastPlayer = newCardsInTrick.length >= game.players.length;
    const nextPlayer = getNextPlayer(player, game);
    const nextPlayerId = wasLastPlayer ? null : nextPlayer.id;
    game.round.trick = {
        cards: newCardsInTrick
    }
    game.round.currentPlayerId = nextPlayerId
    eventBus.trigger(game, { eventType: EventType.CardPlayed, payload: { card, playerId: player.id, nextPlayerId }})

    if(wasLastPlayer) {
        finishTrick(game)
    }
}

function ensureCardAllowed(card: Card, player: PlayerModel, round: Round, currentTrick: Trick) {
    assert(round.trumpSuit !== undefined)
    const allowedCards = getCardsAllowedToBePlayed(player.cards, currentTrick, round.trumpSuit);

    if (!allowedCards.find(c => isSameCard(c, card))) {
        throw new UserError('Cannot play this card');
    }
}

function finishTrick(game: GameModel) {
    assert(game.round)
    assert(game.round.trick)
    assert(game.round.trumpSuit !== undefined)
    const currentTrick = game.round.trick
    const winningPlayerId = getHighestCardPlayerId(currentTrick, game.round.trumpSuit)

    getPlayerById(game, winningPlayerId).tricksWon++
    eventBus.trigger(game, { eventType: EventType.TrickEnd, payload: { winningPlayerId }})

    if (game.players[0].cards.length > 0) {
        game.round.trick = {
            cards: []
        }
        game.round.currentPlayerId = winningPlayerId
        eventBus.trigger(game, {eventType: EventType.NewTrick, payload: {startPlayerId: winningPlayerId}})
    } else {
        game.round.trick = undefined
        eventBus.trigger(game, {eventType: EventType.RoundEnd, payload: {}})

        startAnotherRound(game)
    }
}

function getHighestCardPlayerId(currentTrick: Trick, trumpSuit: Suit): string {
    return getHighestCardValue(currentTrick.cards, currentTrick.cards[0].card.suit, trumpSuit)!.item.playerId
}

