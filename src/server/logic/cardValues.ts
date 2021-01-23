import {Card, Rank, Suit} from "../../shared/Card";
import {isWeli} from "../../shared/cardUtils";
import assert from "assert";
import {Trick} from "../../shared/PlayerGameState";

export function getHighestCardValue<T extends { card: Card }>(cardContainers: T[], initialSuit: Suit, trumpSuit: Suit): { value: number, item: T } | null {
    return cardContainers.map(c => ({
        value: getCardValue(c.card, initialSuit, trumpSuit),
        item: c as T
    })).sort((a, b) => b.value - a.value)[0] || null;
}

export function sortCardsByValueAndRank(cards: Card[], initialSuit: Suit, trumpSuit: Suit) {
    return cards.map(c => ({
        value: getCardValue(c, initialSuit, trumpSuit),
        card: c
    })).sort((a, b) => {
        const valueDiff = b.value - a.value;
        if (valueDiff === 0) {
            return b.card.rank - a.card.rank
        }
        return valueDiff
    });
}

export function getInitialSuit(trick: Trick, trumpSuit: Suit): Suit {
    assert(trick.cards.length > 0)
    const initialCard = trick.cards[0];
    return isWeli(initialCard.card) ? trumpSuit : initialCard.card.suit
}

export function getCardValue(card: Card, initialSuit: Suit, trumpSuit: Suit): number {
    const trumpOffset: number = Rank.Deuce + 1;
    if (isWeli(card)) {
        return trumpOffset + Rank.Deuce - 0.5
    }

    if (card.suit === trumpSuit) {
        return card.rank + trumpOffset
    } else if (card.suit === initialSuit) {
        return card.rank
    }
    return 0
}
