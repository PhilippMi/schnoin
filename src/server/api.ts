import {NextFunction, Request, Response, Router} from 'express';
import {PlayerGameState} from "../shared/PlayerGameSate";
import {getGame} from "./GamesRepository";
import {Card} from "../shared/Card";
import {playCard} from "./GameLogic";
import {UserError} from "./UserError";

export const apiRouter = Router();

apiRouter.get('/game/:id/state/', (req, res) => {
    const game = getGame(req.params.id)
    const player = game.players[0]
    const state: PlayerGameState = {
        player,
        opponents: [],
        trick: game.trick
    }
    res.send(state)
})

apiRouter.post('/game/:id/trick', (req, res) => {
    const game = getGame(req.params.id)
    const card: Card = { suit: req.body.suit, rank: req.body.rank};
    playCard(game, '0', card)
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
