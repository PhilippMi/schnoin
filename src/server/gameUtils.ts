import {GameModel} from "./GameModel";
import {UserError} from "./UserError";

export function getPlayerById(game: GameModel, playerId: string) {
    const player = game.players.find(p => p.id === playerId)
    if (!player) {
        throw new UserError(`cannot find player ${playerId} for game ${game.id}`)
    }
    return player
}

export function getPlayerByToken(game: GameModel, playerToken: string) {
    const player = game.players.find(p => p.token === playerToken)
    if (!player) {
        throw new UserError(`cannot find player with token ${playerToken} for game ${game.id}`)
    }
    return player
}
