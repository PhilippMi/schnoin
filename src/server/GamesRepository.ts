import {GameModel} from "./GameModel";
import {GamePhase} from "../shared/PlayerGameState";
import {startGameMaster} from "./GameMaster";

const games: GameModel[] = [];

export function getGame(id: string): GameModel {
    let game = games.find(g => g.id === id);
    if (!game) {
        if (games.length > 50) {
            games.splice(5)
        }
        game = createGame(id)
        startGameMaster(game)
        games.push(game)
    }
    return game
}

function createGame(id: string): GameModel {
    return {
        id,
        phase: GamePhase.Created,
        players: [],
        startPlayerIndex: 0
    }
}
