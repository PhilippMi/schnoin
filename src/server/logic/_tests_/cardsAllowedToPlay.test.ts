import {getCardsAllowedToBePlayed} from "../cardsAllowedToPlay";
import {Card, Rank, Suit} from "../../../shared/Card";
import {Trick} from "../../../shared/PlayerGameState";

const weli = {suit: Suit.Bells, rank: Rank.Six}

const acorns7 = {suit: Suit.Acorns, rank: Rank.Seven}
const acorns8 = {suit: Suit.Acorns, rank: Rank.Eight}
const acorns9 = {suit: Suit.Acorns, rank: Rank.Nine}
const acorns10 = {suit: Suit.Acorns, rank: Rank.Ten}
const acornsUnder = {suit: Suit.Acorns, rank: Rank.Under}
const acornsOver = {suit: Suit.Acorns, rank: Rank.Over}
const acornsKing = {suit: Suit.Acorns, rank: Rank.King}
const acornsDeuce = {suit: Suit.Acorns, rank: Rank.Deuce}

const bells7 = {suit: Suit.Bells, rank: Rank.Seven}
const bells8 = {suit: Suit.Bells, rank: Rank.Eight}
const bells9 = {suit: Suit.Bells, rank: Rank.Nine}
const bells10 = {suit: Suit.Bells, rank: Rank.Ten}
const bellsUnder = {suit: Suit.Bells, rank: Rank.Under}
const bellsOver = {suit: Suit.Bells, rank: Rank.Over}
const bellsKing = {suit: Suit.Bells, rank: Rank.King}
const bellsDeuce = {suit: Suit.Bells, rank: Rank.Deuce}

const leaves7 = {suit: Suit.Leaves, rank: Rank.Seven}
const leaves8 = {suit: Suit.Leaves, rank: Rank.Eight}
const leaves9 = {suit: Suit.Leaves, rank: Rank.Nine}
const leaves10 = {suit: Suit.Leaves, rank: Rank.Ten}
const leavesUnder = {suit: Suit.Leaves, rank: Rank.Under}
const leavesOver = {suit: Suit.Leaves, rank: Rank.Over}
const leavesKing = {suit: Suit.Leaves, rank: Rank.King}
const leavesDeuce = {suit: Suit.Leaves, rank: Rank.Deuce}

const hearts7 = {suit: Suit.Hearts, rank: Rank.Seven}
const hearts8 = {suit: Suit.Hearts, rank: Rank.Eight}
const hearts9 = {suit: Suit.Hearts, rank: Rank.Nine}
const hearts10 = {suit: Suit.Hearts, rank: Rank.Ten}
const heartsUnder = {suit: Suit.Hearts, rank: Rank.Under}
const heartsOver = {suit: Suit.Hearts, rank: Rank.Over}
const heartsKing = {suit: Suit.Hearts, rank: Rank.King}
const heartsDeuce = {suit: Suit.Hearts, rank: Rank.Deuce}


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
