import {Card, Rank, Suit} from "../shared/Card"

export class Deck {
    cards: Card[]

    constructor() {
        const newCards = createDeck()
        this.cards = shuffle(newCards);
    }

    public distribute(nPlayers: number): Card[][] {
        return Array(nPlayers).fill(null).map(() => this.popCards(5));
    }

    public popCards(nCards: number): Card[] {
        return this.cards.splice(0, nCards);
    }

}

function createDeck(): Card[] {
    const cards: Card[] = []
    for (let suitName in Suit) {
        const suit = Number(suitName)
        if (!isNaN(suit)) {
            for (let rankName in Rank) {
                const rank = Number(rankName)
                if (!isNaN(rank) && (rank !== Rank.Six || suit === Suit.Bells)) {
                    cards.push({suit, rank})
                }
            }
        }
    }
    return cards
}

function shuffle(cards: Card[]): Card[] {
    const result = cards.concat([]);
    result.sort(() => Math.random() - 0.5);
    return result;
}
