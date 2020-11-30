import {NextFunction, Request, Response, Router} from 'express';
import {Opponent, PlayerGameState} from "../shared/PlayerGameSate";
import {getGame} from "./GamesRepository";
import {Card} from "../shared/Card";
import {playCard} from "./GameLogic";
import {UserError} from "./UserError";
import {GameModel, Player} from "./GameModel";
import {registerPlayer, startGame} from "./GameManagement";
import {getEventsForGame} from "./eventStore";
import {Event} from "../shared/Event";

export const apiRouter = Router();

apiRouter.put('/game/:gameId/register/', (req, res) => {
    const game = getGame(req.params.gameId)
    registerPlayer(game, req.body.token, req.body.name);
    res.status(201).send();
})

apiRouter.post('/game/:gameId/start/', (req, res) => {
    const game = getGame(req.params.gameId)
    startGame(game);
    res.status(201).send();
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
        player: {
            id: player.id,
            name: player.name,
            cards: player.cards,
            tricksWon: player.tricksWon
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
        tricksWon: opponent.tricksWon
    }
}

apiRouter.post('/game/:id/trick', (req, res) => {
    const game = getGame(req.params.id)
    const card: Card = { suit: req.body.suit, rank: req.body.rank};
    playCard(game, game.players[0].id, card)
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
