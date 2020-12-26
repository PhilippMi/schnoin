import {NextFunction, Request, Response, Router} from 'express';
import {Opponent, PlayerGameState} from "../shared/PlayerGameState";
import {getGame} from "./GamesRepository";
import {Card} from "../shared/Card";
import {playCard} from "./GameLogic";
import {UserError} from "./UserError";
import {GameModel, Player} from "./GameModel";
import {markPlayerReady, registerPlayer} from "./GameManagement";
import {getEventsForGame} from "./eventStore";
import {Event} from "../shared/Event";

export const apiRouter = Router();

apiRouter.put('/game/:gameId/register/', (req, res) => {
    const game = getGame(req.params.gameId)
    registerPlayer(game, req.body.token, req.body.name)
    res.status(201).send()
})

apiRouter.post('/game/:gameId/ready/', (req, res) => {
    const game = getGame(req.params.gameId)
    markPlayerReady(game, req.body.token)
    res.status(200).send()
})

apiRouter.get('/game/:gameId/', (req, res) => {
    const playerToken = req.query.token as string
    const game = getGame(req.params.gameId)
    res.send(mapToGameState(game, playerToken))
})

apiRouter.get('/game/:gameId/events/:lastEvent', (req, res) => {
    const game = getGame(req.params.gameId)
    const events = getEventsForGame(game)

    const lastEventId = req.params.lastEvent
    if (lastEventId === 'null') {
        return events
    }

    const lastEventIndex = events.findIndex(e => e.id === lastEventId)
    if (lastEventIndex === -1) {
        throw new UserError(`Unknown event ${lastEventId}`)
    }
    res.send(events.slice(lastEventIndex + 1))
})

function mapToGameState(game: GameModel, playerToken: string): PlayerGameState {
    const player = game.players.find(p => p.token === playerToken)
    if (!player) {
        throw new UserError(`No player with token ${playerToken} found`)
    }

    const opponents = game.players.filter(p => p !== player)
    const events = getEventsForGame(game);
    const lastEvent: Event | undefined = events[events.length - 1]
    return {
        id: game.id,
        gamePhase: game.phase,
        player: {
            id: player.id,
            name: player.name,
            cards: player.cards,
            tricksWon: player.tricksWon,
            ready: player.ready
        },
        opponents: opponents.map(mapOpponent),
        trick: game.trick,
        lastEventId: lastEvent?.id || null
    }
}

function mapOpponent(opponent: Player): Opponent {
    return {
        id: opponent.id,
        name: opponent.name,
        nCards: opponent.cards.length,
        tricksWon: opponent.tricksWon,
        ready: opponent.ready
    }
}

apiRouter.post('/game/:id/trick', (req, res) => {
    const game = getGame(req.params.id)
    const card: Card = req.body.card;
    playCard(game, req.body.token, card)
    res.send('ok')
})

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction)  => {
    console.error(err.stack)
    if (err instanceof UserError) {
        res.status(400).send('input error');
    } else {
        res.status(500).send('Something broke!')
    }
})
