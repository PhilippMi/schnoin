import {Card, Rank, Suit} from "../../shared/Card";
import {isWeli} from "../../shared/cardUtils";

export function getHighestCardValue<T extends { card: Card }>(cardContainers: T[], initialSuit: Suit, trumpSuit: Suit): { value: number, item: T } | null {
    return cardContainers.map(c => ({
        value: getCardValue(c.card, initialSuit, trumpSuit),
        item: c as T
    })).sort((a, b) => b.value - a.value)[0] || null;
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
