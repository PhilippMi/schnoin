import {playCard} from '../playCard';
import {GamePhase, RoundPhase, Trick} from '../../../shared/PlayerGameState';
import {Rank, Suit} from '../../../shared/Card';
import {GameModel, PlayerModel} from "../../GameModel";

it('should not allow playing a card for a game which has not yet started', () => {
    const game: GameModel = {
        phase: GamePhase.Created
    } as GameModel
    expect(() => playCard(game, '123', {suit: Suit.Acorns, rank: Rank.Eight})).toThrowError('Game has not yet started or is already finished')
})

it('should not allow playing a card for a game which has already finished', () => {
    const game: GameModel = {
        phase: GamePhase.Finished
    } as GameModel
    expect(() => playCard(game, '123', {suit: Suit.Acorns, rank: Rank.Eight})).toThrowError('Game has not yet started or is already finished')
})

it('should not allow playing a card if is not the playing player\' turn', () => {
    const playingPlayer: PlayerModel = {
        token: '123',
        id: '111',
        name: 'Player1',
        ready: true,
        cards: [],
        tricksWon: 0
    };
    const otherPlayer: PlayerModel = {
        token: '456',
        id: '222',
        name: 'Player2',
        ready: true,
        cards: [],
        tricksWon: 0
    };
    const trick: Trick = {
        cards: [],
    }
    const game: GameModel = {
        phase: GamePhase.Started,
        players: [playingPlayer, otherPlayer],
        round: {
            phase: RoundPhase.Play,
            currentPlayerId: '222',
            trick
        }
    } as GameModel
    expect(() => playCard(game, '123', {suit: Suit.Acorns, rank: Rank.Eight})).toThrowError('It is not player Player1\'s turn')
})
