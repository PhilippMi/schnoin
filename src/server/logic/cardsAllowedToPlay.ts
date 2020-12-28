import {Card, Suit} from "../../shared/Card";
import {Trick} from "../../shared/PlayerGameState";
import {isWeli} from "../../shared/cardUtils";
import {getCardValue, getHighestCardValue} from "./cardValues";

export function getCardsAllowedToBePlayed(cards: Card[], currentTrick: Trick, trumpSuit: Suit) {
    if (currentTrick.cards.length === 0) {
        return cards
    }

    const initialSuit: Suit = currentTrick.cards[0].card.suit

    let suitToPlay: Suit | undefined

    if (cards.some(c => c.suit === initialSuit && !isWeli(c))) {
        suitToPlay = initialSuit
    } else if (cards.some(c => c.suit === trumpSuit || isWeli(c))) {
        suitToPlay = trumpSuit
    }

    const cardWithRightSuit = suitToPlay ? cards.filter(c => c.suit === suitToPlay) : cards

    const highestTrickValue = getHighestCardValue(currentTrick.cards, initialSuit, trumpSuit)?.value || -1

    const cardsWithHigherValue = cardWithRightSuit.filter(c => getCardValue(c, initialSuit, trumpSuit) > highestTrickValue)

    if (cardsWithHigherValue.length > 0) {
        return cardsWithHigherValue
    }

    return cardWithRightSuit
}
