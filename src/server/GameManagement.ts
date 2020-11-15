import {GameModel, GamePhase} from "./GameModel";
import {v4 as uuid} from "uuid";
import {Suit} from "../shared/Card";
import {UserError} from "./UserError";

const maxPlayers = 4;

export function registerPlayer(game: GameModel, token: string, name: string) {
    if(game.players.length >= maxPlayers) {
        throw new UserError('Too many players')
    }

    game.players.push({
        name,
        id: uuid(),
        token
    })
}

export function startGame(game: GameModel) {
    if(game.phase !== GamePhase.Created) {
        throw new UserError('Game already started')
    }

    const nAIPlayers = maxPlayers - game.players.length
    for(let i = 0; i < nAIPlayers; i++) {
        registerPlayer(game, uuid(), `AI ${i+1}`);
    }

    game.trumpSuit = Suit.Hearts
    game.stateHistory = [{
        id: uuid(),
        playerState: game.players.map(p => ({
            id: p.id,
            cards: game.deck.popCards(5),
            tricksWon: 0
        })),
        trick: []
    }]
    game.phase = GamePhase.Started
}
