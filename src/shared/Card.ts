export enum Suit {
    Acorns,
    Leaves,
    Hearts,
    Bells
}

export enum Rank {
    Six=6,
    Seven,
    Eight,
    Nine,
    Ten,
    Under,
    Over,
    King,
    Deuce
}

export interface Card {
    suit: Suit;
    rank: Rank;
}
