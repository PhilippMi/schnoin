import {GameModel, Player} from "./GameModel"
import {Card, Rank, Suit} from "../shared/Card"
import {UserError} from "./UserError"
import {GamePhase, Trick} from "../shared/PlayerGameState";
import {eventBus} from "./eventBus";
import {EventType} from "../shared/Event";
import {isSameCard, isWeli} from "../shared/cardUtils";
import {getPlayerById, getPlayerByToken} from "./gameUtils";

export function playCard(game: GameModel, playerToken: string, card: Card) {
    const currentTrick = game.trick
    if (game.phase !== GamePhase.Started || !currentTrick) {
        throw new UserError('game has not yet started')
    }

    const player = getPlayerByToken(game, playerToken);

    if (currentTrick.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    ensureCardAllowed(card, player, game, currentTrick);

    player.cards = player.cards.filter(c => !isSameCard(c, card))
    const newCardsInTrick = currentTrick.cards.concat([{
        playerId: player.id,
        card
    }]);
    const wasLastPlayer = newCardsInTrick.length === game.players.length;
    const nextPlayer = getNextPlayer(player, game);
    const nextPlayerId = wasLastPlayer ? null : nextPlayer.id;
    game.trick = {
        currentPlayerId: nextPlayerId,
        cards: newCardsInTrick
    }
    console.log('next player: ', nextPlayer.name)
    eventBus.trigger(game, { eventType: EventType.CardPlayed, payload: { card, playerId: player.id, nextPlayerId }})

    if(wasLastPlayer) {
        finishTrick(game)
    }
}

function ensureCardAllowed(card: Card, player: Player, game: GameModel, currentTrick: Trick) {
    const allowedCards = getCardsAllowedToBePlayed(player.cards, currentTrick, game.trumpSuit);

    if (!allowedCards.find(c => isSameCard(c, card))) {
        throw new UserError('Cannot play this card');
    }
}

export function getCardsAllowedToBePlayed(cards: Card[], currentTrick: Trick, trumpSuit: Suit) {
    if (currentTrick.cards.length === 0) {
        return cards
    }

    const initialSuit: Suit = currentTrick.cards[0].card.suit

    let suitToPlay: Suit | undefined

    if (cards.some(c => c.suit === initialSuit && !isWeli(c))) {
        suitToPlay = initialSuit
    } else if(cards.some(c => c.suit === trumpSuit || isWeli(c))) {
        suitToPlay = trumpSuit
    }

    const cardWithRightSuit = suitToPlay ? cards.filter(c => c.suit === suitToPlay) : cards

    const highestTrickValue = getHighestCardValue(currentTrick.cards, initialSuit, trumpSuit)?.value || -1

    const cardsWithHigherValue = cards.filter(c => getCardValue(c, initialSuit, trumpSuit) > highestTrickValue)

    if (cardsWithHigherValue.length > 0) {
        return cardsWithHigherValue
    }

    return cardWithRightSuit
}

function finishTrick(game: GameModel) {
    const currentTrick = game.trick
    const winningPlayerId = getHighestCardPlayerId(currentTrick, game.trumpSuit)

    getPlayerById(game, winningPlayerId).tricksWon++
    eventBus.trigger(game, { eventType: EventType.TrickEnd, payload: { winningPlayerId }})

    game.trick = {
        currentPlayerId: winningPlayerId,
        cards: []
    }
    eventBus.trigger(game, { eventType: EventType.NewTrick, payload: { startPlayerId: winningPlayerId }})
}

function getHighestCardPlayerId(currentTrick: Trick, trumpSuit: Suit): string {
    return getHighestCardValue(currentTrick.cards, currentTrick.cards[0].card.suit, trumpSuit)!.item.playerId
}

function getHighestCardValue<T extends {card: Card}>(cardContainers: T[], initialSuit: Suit, trumpSuit: Suit): {value: number, item: T} | null {
    return cardContainers.map(c => ({
        value: getCardValue(c.card, initialSuit, trumpSuit),
        item: c as T
    })).sort((a, b) => b.value - a.value)[0] || null;
}


function getCardValue(card: Card, initialSuit: Suit, trumpSuit: Suit): number {
    const trumpOffset: number = Rank.Deuce + 1;
    if (isWeli(card)) {
        return trumpOffset + Rank.Deuce - 0.5
    }

    if (card.suit === trumpSuit) {
        return card.rank + trumpOffset
    } else if (card.suit === initialSuit) {
        return card.rank
    }
    return 0
}

function getNextPlayer(currentPlayer: Player, game: GameModel): Player {
    const index = game.players.indexOf(currentPlayer);
    if (index === -1) {
        throw new Error(`cannot find player ${currentPlayer.name}`)
    }
    const nextIndex = (index + 1) % game.players.length
    return game.players[nextIndex]
}
