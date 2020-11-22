import {GameModel, GamePhase, Player} from "./GameModel";
import {v4 as uuid} from "uuid";
import {Suit} from "../shared/Card";
import {UserError} from "./UserError";
import {AiPlayer} from "./ai/ai-player";
import {Event, eventBus} from "./event-bus";

const maxPlayers = 4;

export function registerPlayer(game: GameModel, token: string, name: string) {
    if(game.players.length >= maxPlayers) {
        throw new UserError('Too many players')
    }

    const newPlayer: Player = {
        name,
        id: uuid(),
        token
    };
    game.players.push(newPlayer)
    return newPlayer;
}

export function startGame(game: GameModel) {
    if(game.phase !== GamePhase.Created) {
        throw new UserError('Game already started')
    }

    const nAIPlayers = maxPlayers - game.players.length
    for(let i = 0; i < nAIPlayers; i++) {
        new AiPlayer(game)
    }

    game.trumpSuit = Suit.Hearts
    game.stateHistory = [{
        id: uuid(),
        playerState: game.players.map(p => ({
            id: p.id,
            cards: game.deck.popCards(5),
            tricksWon: 0
        })),
        trick: {
            currentPlayerId: game.players[0].id,
            cards: []
        }
    }]
    game.phase = GamePhase.Started
    eventBus.trigger(game, Event.NewTrick)
}
