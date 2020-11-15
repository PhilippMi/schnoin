import {GameModel, GamePhase} from "./GameModel";
import {Deck} from "./Deck";
import {Suit} from "../shared/Card";

const games: GameModel[] = [];

export function getGame(id: string): GameModel {
    let game = games.find(g => g.id === id);
    if (!game) {
        if (games.length > 50) {
            games.splice(5)
        }
        game = createGame(id)
        games.push(game)
    }
    return game
}

function createGame(id: string): GameModel {
    const deck = new Deck();
    return {
        id,
        phase: GamePhase.Created,
        deck,
        players: [],
        trumpSuit: Suit.Hearts,
        stateHistory: []
    }
}
