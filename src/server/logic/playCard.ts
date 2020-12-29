import {GameModel, Player} from "../GameModel"
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

export function playCard(game: GameModel, playerToken: string, card: Card) {
    if (game.phase !== GamePhase.Started) {
        throw new UserError('Game has not yet started or is already finished')
    }

    const currentTrick = game.round?.trick
    if (!game.round || game.round.phase !== RoundPhase.Play || !currentTrick) {
        throw new UserError('Round has not yet started or is already finished')
    }

    const player = getPlayerByToken(game, playerToken);

    if (currentTrick.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    ensureCardAllowed(card, player, game.round, currentTrick);

    player.cards = player.cards.filter(c => !isSameCard(c, card))
    const newCardsInTrick = currentTrick.cards.concat([{
        playerId: player.id,
        card
    }]);
    const wasLastPlayer = newCardsInTrick.length === game.players.length;
    const nextPlayer = getNextPlayer(player, game);
    const nextPlayerId = wasLastPlayer ? null : nextPlayer.id;
    game.round.trick = {
        currentPlayerId: nextPlayerId,
        cards: newCardsInTrick
    }
    console.log('next player: ', nextPlayer.name)
    eventBus.trigger(game, { eventType: EventType.CardPlayed, payload: { card, playerId: player.id, nextPlayerId }})

    if(wasLastPlayer) {
        finishTrick(game)
    }
}

function ensureCardAllowed(card: Card, player: Player, round: Round, currentTrick: Trick) {
    assert(round.trumpSuit)
    const allowedCards = getCardsAllowedToBePlayed(player.cards, currentTrick, round.trumpSuit);

    if (!allowedCards.find(c => isSameCard(c, card))) {
        throw new UserError('Cannot play this card');
    }
}

function finishTrick(game: GameModel) {
    assert(game.round)
    assert(game.round.trick)
    assert(game.round.trumpSuit)
    const currentTrick = game.round.trick
    const winningPlayerId = getHighestCardPlayerId(currentTrick, game.round.trumpSuit)

    getPlayerById(game, winningPlayerId).tricksWon++
    eventBus.trigger(game, { eventType: EventType.TrickEnd, payload: { winningPlayerId }})

    if (game.players[0].cards.length > 0) {
        game.round.trick = {
            currentPlayerId: winningPlayerId,
            cards: []
        }
        eventBus.trigger(game, {eventType: EventType.NewTrick, payload: {startPlayerId: winningPlayerId}})
    } else {
        game.round.trick = undefined
        game.phase = GamePhase.Finished
        eventBus.trigger(game, {eventType: EventType.RoundEnd, payload: {}})
    }
}

function getHighestCardPlayerId(currentTrick: Trick, trumpSuit: Suit): string {
    return getHighestCardValue(currentTrick.cards, currentTrick.cards[0].card.suit, trumpSuit)!.item.playerId
}

function getNextPlayer(currentPlayer: Player, game: GameModel): Player {
    const index = game.players.indexOf(currentPlayer);
    if (index === -1) {
        throw new Error(`cannot find player ${currentPlayer.name}`)
    }
    const nextIndex = (index + 1) % game.players.length
    return game.players[nextIndex]
}
