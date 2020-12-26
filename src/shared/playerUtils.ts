import {maxPlayers} from "./constants";


export function getOpponentIndexForPlayer(playerIndex: number, opponentIndex: number) {
    return (opponentIndex - playerIndex + maxPlayers) % maxPlayers - 1
}
