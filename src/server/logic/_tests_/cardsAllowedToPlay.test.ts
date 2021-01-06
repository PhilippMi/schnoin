import {getCardsAllowedToBePlayed} from "../cardsAllowedToPlay";
import {Card, Suit} from "../../../shared/Card";
import {Trick} from "../../../shared/PlayerGameState";
import {
    acorns7,
    acorns8,
    acornsKing,
    bells10,
    bells7,
    bells8,
    bells9,
    bellsDeuce,
    bellsOver,
    hearts10,
    hearts7,
    hearts8,
    hearts9,
    heartsDeuce,
    heartsKing,
    leaves10,
    leaves7,
    leaves9,
    weli
} from "./allCards";


it('should return all cards if the trick is still empty', () => {
    const trick = createTrick()
    expect(getCardsAllowedToBePlayed([acorns7, bells9, heartsKing], trick, Suit.Hearts)).toEqual(
        [acorns7, bells9, heartsKing]
    )
})

it('should return cards of the same suit as the initial suit', () => {
    const trick = createTrick(bells7)
    expect(getCardsAllowedToBePlayed([acorns7, acorns8, bells9, bells10], trick, Suit.Hearts)).toEqual(
        [bells9, bells10]
    )
})

it('should not return trump cards if the player has cards from the initial suit', () => {
    const trick = createTrick(bells7)
    expect(getCardsAllowedToBePlayed([hearts7, bells9], trick, Suit.Hearts)).toEqual(
        [bells9]
    )
})

it('should return trump cards if the player does not have cards from the initial suit', () => {
    const trick = createTrick(bells7)
    expect(getCardsAllowedToBePlayed([acorns7, hearts7, hearts9], trick, Suit.Hearts)).toEqual(
        [hearts7, hearts9]
    )
})

it('should return all cards if the player does not have cards form the initial or trump suit', () => {
    const trick = createTrick(bells7)
    expect(getCardsAllowedToBePlayed([acorns7, leaves7, leaves9], trick, Suit.Hearts)).toEqual(
        [acorns7, leaves7, leaves9]
    )
})

it('should return cards higher than the cards in the trick if the player has higher cards', () => {
    const trick = createTrick(bells7, bells10)
    expect(getCardsAllowedToBePlayed([bells8, acornsKing, bellsOver], trick, Suit.Hearts)).toEqual(
        [bellsOver]
    )
})

it('should not return trump cards if the user has cards from the initial trick but none is higher than the trick cards', () => {
    const trick = createTrick(bells7, bellsDeuce)
    expect(getCardsAllowedToBePlayed([bells8, heartsKing, bellsOver], trick, Suit.Hearts)).toEqual(
        [bells8, bellsOver]
    )
})

it('should return trump cards higher than the cards in the trick if the player has no cards from the initial suit', () => {
    const trick = createTrick(bellsDeuce, hearts10)
    expect(getCardsAllowedToBePlayed([acornsKing, heartsKing, hearts8], trick, Suit.Hearts)).toEqual(
        [heartsKing]
    )
})


it('should not return trump cards if the trick already contains a trump card but the user still has cards from the initial suit', () => {
    const trick = createTrick(bells8, hearts10)
    expect(getCardsAllowedToBePlayed([acornsKing, bells10, hearts8], trick, Suit.Hearts)).toEqual(
        [bells10]
    )
})

it('should return trump cards if the initial suit is the trump suit', () => {
    const trick = createTrick(heartsKing)
    expect(getCardsAllowedToBePlayed([acornsKing, hearts8, hearts10], trick, Suit.Hearts)).toEqual(
        [hearts8, hearts10]
    )
})

it('should return all cards if the initial suite is the trump suit but the player has no trump cards', () => {
    const trick = createTrick(heartsKing)
    expect(getCardsAllowedToBePlayed([acornsKing, leaves9, bells8], trick, Suit.Hearts)).toEqual(
        [acornsKing, leaves9, bells8]
    )
})

describe('weli special cases', () => {

    describe('weli in the hand', () => {

        it('should return the weli if the player is allowed to play trump cards', () => {
            const trick = createTrick(bells7)
            expect(getCardsAllowedToBePlayed([acorns7, hearts7, weli], trick, Suit.Hearts)).toEqual(
                [hearts7, weli]
            )
        })

        it('should not return the weli if the player is only allowed to play initial suit cards', () => {
            const trick = createTrick(bells7)
            expect(getCardsAllowedToBePlayed([bells8, weli], trick, Suit.Hearts)).toEqual(
                [bells8]
            )
        })

        it('should return the weli if it is the only card of value (no other trump or initial suit card)', () => {
            const trick = createTrick(leaves9)
            expect(getCardsAllowedToBePlayed([acornsKing, bells8, weli], trick, Suit.Hearts)).toEqual(
                [weli]
            )
        })

        it('should return the weli if it is the only card higher than the highest trick card', () => {
            const trick = createTrick(heartsKing)
            expect(getCardsAllowedToBePlayed([acornsKing, hearts10, weli], trick, Suit.Hearts)).toEqual(
                [weli]
            )
        })

    })

    describe('weli in the trick', () => {

        it('should only return trump cards if the initial card is the weli', () => {
            const trick = createTrick(weli)
            expect(getCardsAllowedToBePlayed([acornsKing, bells10, hearts10], trick, Suit.Hearts)).toEqual(
                [hearts10]
            )
        })

        it('should only return cards higher than the weli if the player has one and the weli is in the trick', () => {
            const trick = createTrick(bells8, weli)
            expect(getCardsAllowedToBePlayed([leaves10, heartsKing, heartsDeuce], trick, Suit.Hearts)).toEqual(
                [heartsDeuce]
            )
        })

    })

})


function createTrick(... cardValues: Card[]): Trick {
    const cards: Trick['cards'] = cardValues.map((c, i) => ({
        playerId: `${i}`,
        card: c
    }))
    return {
        cards
    }
}
