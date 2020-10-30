import {Router} from 'express';
import {PlayerGameState} from "../shared/PlayerGameSate";
import {Rank, Suit} from "../shared/Card";

export const apiRouter = Router();

apiRouter.get('/state', (req, res) => {
    const state: PlayerGameState = {
        myCards: [{
            rank: Rank.Deuce,
            suit: Suit.Hearts
        }, {
            rank: Rank.King,
            suit: Suit.Acorns
        }, {
            rank: Rank.Six,
            suit: Suit.Bells
        }, {
            rank: Rank.Eight,
            suit: Suit.Leaves
        }, {
            rank: Rank.Seven,
            suit: Suit.Acorns
        }]
    }
    res.send(state);
})
