import {GameModel, PlayerModel} from "../GameModel";

export function getNextPlayer(currentPlayer: PlayerModel, game: GameModel): PlayerModel {
    const index = game.players.indexOf(currentPlayer);
    if (index === -1) {
        throw new Error(`cannot find player ${currentPlayer.name}`)
    }
    const nextIndex = (index + 1) % game.players.length
    return game.players[nextIndex]
}
