import {GameModel, GameState} from "./GameModel"
import {Card, Rank, Suit} from "../shared/Card"
import {UserError} from "./UserError"
import {v4 as uuid} from "uuid";
import {isWeli} from "./cardUtils";

export function playCard(game: GameModel, playerId: string, card: Card) {
    const playerState = getCurrentPlayerState(game, playerId)
    const cardIndex = playerState.cards.findIndex(c => c.suit === card.suit && c.rank === card.rank)
    if (cardIndex === -1) {
        throw new UserError('Cannot play card the user does not possess')
    }

    const newState = updateGame(game);

    const newPlayerState = getCurrentPlayerState(game, playerId)
    newPlayerState.cards = playerState.cards.filter(c => c.suit !== card.suit || c.rank !== card.rank)
    newState.trick.push({
        playerId,
        card
    })

    if(newState.trick.length === game.players.length) {
        finishTrick(game)
    }
}

function finishTrick(game: GameModel) {
    const currentTrick = game.stateHistory[0].trick
    const playerId = getHighestCardPlayerId(currentTrick, game.trumpSuit)

    const newState = updateGame(game)
    getCurrentPlayerState(game, playerId).tricksWon++
    newState.trick = []
}

function getHighestCardPlayerId(currentTrick: GameState['trick'], trumpSuit: Suit): string {
    return currentTrick.map(t => ({
        value: getCardValue(t.card, currentTrick[0].card.suit, trumpSuit),
        playerId: t.playerId
    })).sort((a, b) => b.value - a.value)[0].playerId
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
