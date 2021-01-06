import {buyCards} from "../buyCards";
import {GameModel, PlayerModel} from "../../GameModel";
import {heartsDeuce, heartsKing, heartsOver, leaves10, leaves7, leaves8, leaves9, leavesUnder} from "./allCards";
import {GamePhase, RoundPhase} from "../../../shared/PlayerGameState";
import {Deck} from "../../Deck";

jest.mock('../../Deck');

it('should exchange the selected cards with new ones from the deck', () => {
    const deck = new Deck();
    (deck.popCards as jest.MockedFunction<Deck['popCards']>).mockReturnValue([heartsDeuce, heartsKing, heartsOver]);
    (deck.size as any) = 20

    const game: GameModel = {
        id: '1',
        startPlayerIndex: 0,
        phase: GamePhase.Started,
        players: [
            {
                id: '1',
                token: '123',
                name: 'Player1',
                ready: true,
                tricksWon: 0,
                cards: [leaves7, leaves8, leaves9, leaves10, leavesUnder]
            },
            {} as PlayerModel
        ],
        round: {
            phase: RoundPhase.Buying,
            cardsExchanged: [],
            currentPlayerId: '1',
            deck,
            bets: []
        }
    }

    buyCards(game, '123', [leaves8, leaves9, leavesUnder])

    const newCards = game.players[0].cards;
    expect(newCards).toEqual([leaves7, leaves10, heartsDeuce, heartsKing, heartsOver])
    expect(deck.popCards).toHaveBeenCalledWith(3)
});
