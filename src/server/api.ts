import {Router} from 'express';
import {PlayerGameState} from "../shared/PlayerGameSate";
import {getGame} from "./GamesRepository";

export const apiRouter = Router();

apiRouter.get('/game/:id/state/', (req, res) => {
    const game = getGame(req.params.id);
    const state: PlayerGameState = {
        myCards: game.players[0].cards
    }
    res.send(state);
})
