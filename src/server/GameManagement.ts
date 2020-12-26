import {GameModel, Player} from "./GameModel";
import {v4 as uuid} from "uuid";
import {Suit} from "../shared/Card";
import {UserError} from "./UserError";
import {eventBus} from "./eventBus";
import {EventType} from "../shared/Event";
import {GamePhase} from "../shared/PlayerGameState";
import {maxPlayers} from "../shared/constants";

export function registerPlayer(game: GameModel, token: string, name: string) {
    if(game.phase !== GamePhase.Created) {
        throw new UserError('Game already started')
    }
    if(game.players.length >= maxPlayers) {
        throw new UserError('Too many players')
    }

    const newPlayer: Player = {
        ready: false,
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
            id: newPlayer.id,
            index: game.players.length - 1
        }
    })
    return newPlayer
}

export function markPlayerReady(game: GameModel, playerToken: string) {
    const player = game.players.find(p => p.token === playerToken)
    if (!player) {
        throw new UserError('Cannot find player');
    }

    player.ready = true

    eventBus.trigger(game, {
        eventType: EventType.PlayerReady,
        payload: {
            playerId: player.id
        }
    })
}

export function startGame(game: GameModel) {
    if(game.phase !== GamePhase.Created) {
        throw new Error('Game already started')
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
