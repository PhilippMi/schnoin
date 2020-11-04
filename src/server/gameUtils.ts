import {GameModel, GameState, Player, PlayerState} from "./GameModel";

export function getStateForPlayer(player: Player, gameState: GameState): PlayerState {
    const state = gameState.playerState.find(p => p.id === player.id)
    if (!state) {
        throw new Error(`Cannot find state for player ${player.id}`)
    }
    return state
}
