import {GameModel, GamePhase, GameState, Player, PlayerState} from "./GameModel"
import {Card, Rank, Suit} from "../shared/Card"
import {UserError} from "./UserError"
import {v4 as uuid} from "uuid";
import {isWeli} from "./cardUtils";
import {Trick} from "../shared/PlayerGameSate";
import {getCurrentTrick} from "./gameUtils";
import {eventBus} from "./eventBus";
import {EventType} from "../shared/Event";

export function playCard(game: GameModel, playerId: string, card: Card) {
    const currentTrick = getCurrentTrick(game)
    if (game.phase !== GamePhase.Started || !currentTrick) {
        throw new UserError('game has not yet started')
    }

    if (currentTrick.currentPlayerId !== playerId) {
        throw new UserError(`It is not player ${playerId}'s turn`)
    }

    const playerState = getCurrentPlayerState(game, playerId)
    ensureCardAllowed(card, playerState, game, currentTrick);

    const newState = updateGame(game);

    const newPlayerState = getCurrentPlayerState(game, playerId)
    newPlayerState.cards = playerState.cards.filter(c => c.suit !== card.suit || c.rank !== card.rank)
    const newCardsInTrick = currentTrick.cards.concat([{
        playerId,
        card
    }]);
    const wasLastPlayer = newCardsInTrick.length === game.players.length;
    let nextPlayerId = wasLastPlayer ? null : getNextPlayer(playerId, game).id;
    newState.trick = {
        currentPlayerId: nextPlayerId,
        cards: newCardsInTrick
    }
    eventBus.trigger(game, { eventType: EventType.CardPlayed, payload: { card, playerId, nextPlayerId }})

    if(wasLastPlayer) {
        finishTrick(game)
    }
}

function ensureCardAllowed(card: Card, playerState: PlayerState, game: GameModel, currentTrick: Trick) {
    const allowedCards = getCardsAllowedToBePlayed(playerState.cards, currentTrick, game.trumpSuit);

    if (!allowedCards.find(c => c.suit === card.suit && c.rank === card.rank)) {
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
    const currentTrick = game.stateHistory[0].trick
    const winningPlayerId = getHighestCardPlayerId(currentTrick, game.trumpSuit)

    const newState = updateGame(game)
    getCurrentPlayerState(game, winningPlayerId).tricksWon++
    eventBus.trigger(game, { eventType: EventType.TrickEnd, payload: { winningPlayerId }})

    newState.trick = {
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

function updateGame(game: GameModel): GameState {
    const newState: GameState = JSON.parse(JSON.stringify(game.stateHistory[0]))
    newState.id = uuid();
    game.stateHistory.splice(0, 0, newState)
    return newState
}

function getCurrentPlayerState(game: GameModel, playerId: string) {
    const currentGameState = game.stateHistory[0];
    const playerState = currentGameState.playerState.find(p => p.id === playerId)
    if (!playerState) {
        throw new UserError(`cannot find player ${playerId} for game ${game.id}`)
    }
    return playerState
}

function getNextPlayer(currentPlayerId: string, game: GameModel): Player {
    const index = game.players.findIndex(p => p.id === currentPlayerId)
    if (index === -1) {
        throw new Error(`cannot find player ${currentPlayerId}`)
    }
    const nextIndex = (index + 1) % game.players.length
    return game.players[nextIndex]
}
