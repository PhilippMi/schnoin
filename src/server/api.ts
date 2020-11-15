import {NextFunction, Request, Response, Router} from 'express';
import {Opponent, PlayerGameState} from "../shared/PlayerGameSate";
import {getGame} from "./GamesRepository";
import {Card} from "../shared/Card";
import {getCardsAllowedToBePlayed, playCard} from "./GameLogic";
import {UserError} from "./UserError";
import {GameModel, GameState, Player} from "./GameModel";
import {getStateForPlayer} from "./gameUtils";

export const apiRouter = Router();

apiRouter.post('/game/:gameId/register/:playerToken', (req, res) => {
    const game = getGame(req.params.gameId)
    res.send(mapToUpdates(game, [game.stateHistory[0]]))
})

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
    const opponents = game.players.filter(p => p !== player)
    return updates.map(update => {
        const playerState = getStateForPlayer(player, update)
        return {
            id: update.id,
            player: {
                id: player.id,
                name: player.name,
                cards: playerState.cards,
                tricksWon: playerState.tricksWon
            },
            opponents: opponents.map(o => mapOpponent(o, update)),
            trick: update.trick
        }
    })
}

function mapOpponent(opponent: Player, update: GameState): Opponent {
    const opponentState = getStateForPlayer(opponent, update)
    return {
        id: opponent.id,
        name: opponent.name,
        nCards: opponentState.cards.length,
        tricksWon: opponentState.tricksWon
    }
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

    function randomCard(cards: Card[]) {
        const currentTrick = game.stateHistory[0].trick
        const allowedCards = getCardsAllowedToBePlayed(cards, currentTrick, game.trumpSuit);
        return allowedCards[Math.floor(Math.random() * allowedCards.length)]
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
