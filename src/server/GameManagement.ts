import {GameModel, GamePhase, Player} from "./GameModel";
import {v4 as uuid} from "uuid";
import {Suit} from "../shared/Card";
import {UserError} from "./UserError";
import {AIPlayer} from "./ai/AIPlayer";
import {eventBus} from "./eventBus";
import {EventType} from "../shared/Event";

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
        new AIPlayer(game)
    }

    game.trumpSuit = Suit.Hearts
    let startPlayerId = game.players[0].id;
    game.playerState = game.players.map(p => ({
        id: p.id,
        cards: game.deck.popCards(5),
        tricksWon: 0
    }))
    game.trick = {
        currentPlayerId: startPlayerId,
        cards: []
    }
    game.phase = GamePhase.Started
    eventBus.trigger(game, { eventType: EventType.NewTrick, payload: { startPlayerId }})
}
