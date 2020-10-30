import {GameModel} from "./GameModel"
import {Card} from "../shared/Card"
import {UserError} from "./UserError"
import {v4 as uuid} from "uuid";

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
    });
}

function updateGame(game: GameModel) {
    const newState = JSON.parse(JSON.stringify(game.stateHistory[0]))
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
