import {NextFunction, Request, Response, Router} from 'express';
import {PlayerGameState} from "../shared/PlayerGameSate";
import {getGame} from "./GamesRepository";
import {Card} from "../shared/Card";
import {playCard} from "./GameLogic";
import {UserError} from "./UserError";
import {GameModel, GameState} from "./GameModel";

export const apiRouter = Router();

apiRouter.get('/game/:gameId/updates/', (req, res) => {
    const game = getGame(req.params.gameId)
    res.send(mapToUpdates(game, [game.stateHistory[0]]))
})

apiRouter.get('/game/:gameId/updates/:lastUpdate', (req, res) => {
    const game = getGame(req.params.gameId)
    const lastUpdateIndex = game.stateHistory.findIndex(s => s.id === req.params.lastUpdate);
    if (lastUpdateIndex === -1) {
        throw new UserError(`Unknown state update ${req.params.lastUpdate}`)
    }
    const updates = game.stateHistory.slice(0, lastUpdateIndex).reverse()
    res.send(mapToUpdates(game, updates))
})

function mapToUpdates(game: GameModel, updates: GameState[]): PlayerGameState[] {
    const player = game.players[0]
    return updates.map(update => {
        const playerState = update.playerState.find(p => p.id === player.id)
        if (!playerState) {
            throw new Error(`cannot find player state for player ${player.id}`)
        }
        return {
            id: update.id,
            player: {
                id: player.id,
                name: player.name,
                cards: playerState.cards,
                tricksWon: playerState.tricksWon
            },
            opponents: [],
            trick: update.trick
        }
    })
}

apiRouter.post('/game/:id/trick', (req, res) => {
    const game = getGame(req.params.id)
    const card: Card = { suit: req.body.suit, rank: req.body.rank};
    playCard(game, '0', card)

    // temporary
    playCard(game, '1', randomCard(game.stateHistory[0].playerState[1].cards))
    playCard(game, '2', randomCard(game.stateHistory[0].playerState[2].cards))
    playCard(game, '3', randomCard(game.stateHistory[0].playerState[3].cards))

    res.send('ok')

    function randomCard<T>(cards: T[]) {
        return cards[Math.floor(Math.random() * cards.length)]
    }
})

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction)  => {
    console.error(err.stack)
    if (err instanceof UserError) {
        res.status(400).send('input error');
    } else {
        res.status(500).send('Something broke!')
    }
})
