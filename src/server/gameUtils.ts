import {GameModel, GameState, Player, PlayerState} from "./GameModel";
import {Trick} from "../shared/PlayerGameSate";

export function getStateForPlayer(player: Player, gameState: GameState): PlayerState {
    const state = gameState.playerState.find(p => p.id === player.id)
    if (!state) {
        throw new Error(`Cannot find state for player ${player.id}`)
    }
    return state
}

export function getCurrentTrick(game: GameModel): Trick | null {
    return game.stateHistory[0]?.trick || null
}
