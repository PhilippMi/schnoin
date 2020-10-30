import {GameModel} from "./GameModel";
import {Deck} from "./Deck";
import {Card} from "../shared/Card";
import {v4 as uuid} from "uuid";

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
    const playerCards = deck.distribute(4);
    let players = playerCards.map((cards, i) => createPlayer(cards, i));
    return {
        id,
        deck,
        players: players.map(p => ({name: p.name, id: p.id})),
        stateHistory: [{
            id: uuid(),
            playerState: players.map(p => ({
                id: p.id,
                cards: p.cards,
                tricksWon: 0
            })),
            trick: []
        }]
    }
}

function createPlayer(cards: Card[], i: number) {
    return {
        cards,
        name: `player ${i+1}`,
        id: i.toString()
    }
}
