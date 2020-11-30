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
        token,
        cards: [],
        tricksWon: 0
    };
    game.players.push(newPlayer)
    eventBus.trigger(game, {
        eventType: EventType.NewPlayer,
        payload: {
            name,
            id: newPlayer.id
        }
    })
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
    game.players.forEach(p => Object.assign(p, {
        cards: game.deck.popCards(5),
        tricksWon: 0
    }))
    game.phase = GamePhase.Started
    eventBus.trigger(game, {
        eventType: EventType.NewRound,
        payload: {
            trumpSuit: game.trumpSuit,
            players: game.players.map(p => ({
                id: p.id,
                nCards: p.cards.length,
                tricksWon: p.tricksWon
            }))
        }
    })

    game.trick = {
        currentPlayerId: startPlayerId,
        cards: []
    }
    eventBus.trigger(game, { eventType: EventType.NewTrick, payload: { startPlayerId }})
}
