import {Card, Suit} from "../../shared/Card";
import {Trick} from "../../shared/PlayerGameState";
import {isWeli} from "../../shared/cardUtils";
import {getCardValue, getHighestCardValue, getInitialSuit} from "./cardValues";

export function getCardsAllowedToBePlayed(cards: Card[], currentTrick: Trick, trumpSuit: Suit) {
    if (currentTrick.cards.length === 0) {
        return cards
    }

    const initialSuit: Suit = getInitialSuit(currentTrick, trumpSuit)

    const filterInitialSuit = filterSuit(initialSuit, trumpSuit);
    let cardWithRightSuit = cards.filter(filterInitialSuit)

    if (cardWithRightSuit.length === 0) {
        const filterTrumpSuit = filterSuit(trumpSuit, trumpSuit)
        cardWithRightSuit = cards.filter(filterTrumpSuit)

        if (cardWithRightSuit.length === 0) {
            cardWithRightSuit = cards
        }
    }

    const highestTrickValue = getHighestCardValue(currentTrick.cards, initialSuit, trumpSuit)?.value || -1

    const cardsWithHigherValue = cardWithRightSuit.filter(c => getCardValue(c, initialSuit, trumpSuit) > highestTrickValue)

    if (cardsWithHigherValue.length > 0) {
        return cardsWithHigherValue
    }

    return cardWithRightSuit
}

function filterSuit(suit: Suit, trumpSuit: Suit) {
    return (card: Card) => {
        if (isWeli(card)) {
            return suit === trumpSuit
        }
        return card.suit === suit
    }
}
