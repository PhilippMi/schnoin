import {GameModel, PlayerModel} from "./GameModel";
import {v4 as uuid} from "uuid";
import {UserError} from "./UserError";
import {eventBus} from "./eventBus";
import {EventType} from "../shared/Event";
import {GamePhase, RoundPhase} from "../shared/PlayerGameState";
import {maxPlayers, nHandCards} from "../shared/constants";
import {Deck} from "./Deck";

export function registerPlayer(game: GameModel, token: string, name: string) {
    if (game.phase !== GamePhase.Created) {
        throw new UserError('Game already started')
    }
    if (game.players.length >= maxPlayers) {
        throw new UserError('Too many players')
    }

    if (!token) {
        throw new UserError('Player does not have a token')
    }

    if (game.players.some(p => p.token === token)) {
        throw new UserError('Player is already registered')
    }

    const newPlayer: PlayerModel = {
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
    startRound(game);
}

export function startAnotherRound(game: GameModel) {
    game.startPlayerIndex = (game.startPlayerIndex + 1) % game.players.length
    startRound(game)
}

function startRound(game: GameModel) {
    const startPlayerId = game.players[game.startPlayerIndex].id;
    const round = {
        deck: new Deck(),
        phase: RoundPhase.Betting,
        currentPlayerId: startPlayerId,
        startPlayerId: startPlayerId,
        cardsExchanged: [],
        bets: []
    };
    game.round = round
    game.players.forEach(p => Object.assign(p, {
        cards: round.deck.popCards(nHandCards),
        tricksWon: 0
    }))
    game.phase = GamePhase.Started
    eventBus.trigger(game, {
        eventType: EventType.NewRound,
        payload: {
            players: game.players.map(p => ({
                id: p.id,
                nCards: p.cards.length,
                tricksWon: p.tricksWon
            }))
        }
    })
}
