import {GameModel, Player, PlayerState} from "./GameModel";

export function getStateForPlayer(player: Player, game: GameModel): PlayerState {
    const state = game.playerState.find(p => p.id === player.id)
    if (!state) {
        throw new Error(`Cannot find state for player ${player.id}`)
    }
    return state
}
