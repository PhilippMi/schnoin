import {GameModel} from "./GameModel";
import {Deck} from "./Deck";
import {Card} from "../shared/Card";

const games: GameModel[] = [];

export function getGame(id: string): GameModel {
    let game = games.find(g => g.id === id);
    if (!game) {
        if (games.length > 50) {
            games.splice(5)
        }
        game = createGame(id)
        games.push(game)
    }
    return game
}

function createGame(id: string): GameModel {
    const deck = new Deck();
    const playerCards = deck.distribute(5);
    return {
        id,
        deck,
        players: playerCards.map((cards, i) => createPlayer(cards, i))
    }
}

function createPlayer(cards: Card[], i: number): GameModel['players'][0] {
    return {
        cards,
        name: `player ${i+1}`,
        tricksWon: 0
    }
}
