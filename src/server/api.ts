import {Router} from 'express';
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Deck} from "./Deck";

export const apiRouter = Router();

apiRouter.get('/state', (req, res) => {
    const deck = new Deck();
    const state: PlayerGameState = {
        myCards: deck.distribute(1)[0]
    }
    res.send(state);
})
