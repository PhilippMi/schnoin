import {eventBus} from "./eventBus";
import {GameModel} from "./GameModel";
import {EventType} from "../shared/Event";
import {startGame} from "./GameManagement";
import {GamePhase} from "../shared/PlayerGameState";
import {AIPlayer} from "./ai/AIPlayer";
import {maxPlayers} from "../shared/constants";

export function startGameMaster(game: GameModel) {
    let gameStarting = false
    eventBus.register(game, undefined, event => {
        if (event.eventType === EventType.PlayerReady && !gameStarting) {
            if (game.phase === GamePhase.Created && game.players.every(p => p.ready)) {
                gameStarting = true
                const nAIPlayers = maxPlayers - game.players.length
                for(let i = 0; i < nAIPlayers; i++) {
                    new AIPlayer(game)
                }
                startGame(game)
            }
        }
    })
}
