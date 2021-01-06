import {Card, Suit} from "./Card";


export enum EventType {
    NewTrick = 'newtrick',
    BetPlaced = 'betplaced',
    BettingEnd = 'bettingend',
    TrumpSuitChosen = 'trumpsuitchosen',
    CardPlayed = 'cardplayed',
    TrickEnd = 'trickend',
    NewPlayer = 'newplayer',
    PlayerReady = 'playerready',
    NewRound = 'newround',
    RoundEnd = 'roundend',
    CardsBought = 'cardsbought',
    BuyingEnd = 'buyingend',
}


export interface BaseEvent {
    id: string
    eventType: EventType
    payload: object
}

export interface NewPlayerEvent extends BaseEvent {
    eventType: EventType.NewPlayer
    payload: {
        name: string
        id: string
        index: number
    }
}

export interface PlayerReadyEvent extends BaseEvent {
    eventType: EventType.PlayerReady
    payload: {
        playerId: string
    }
}

export interface NewRoundEvent extends BaseEvent {
    eventType: EventType.NewRound
    payload: {
        players: {
            id: string
            nCards: number
            tricksWon: number
        }[]
    }
}

export interface RoundEndEvent extends BaseEvent {
    eventType: EventType.RoundEnd
    payload: {}
}

export interface BetPlacedEvent extends BaseEvent {
    eventType: EventType.BetPlaced
    payload: {
        playerId: string
        value: number | null
        nextPlayerId: string | null
    }
}

export interface BettingEndEvent extends BaseEvent {
    eventType: EventType.BettingEnd
    payload: {
        winnerId: string
        betValue: number
    }
}

export interface TrumpSuitChosenEvent extends BaseEvent {
    eventType: EventType.TrumpSuitChosen
    payload: {
        trumpSuit: Suit
    }
}

export interface CardsBoughtEvent extends BaseEvent {
    eventType: EventType.CardsBought,
    payload: {
        playerId: string,
        nCards: number,
        nextPlayerId: string
    }
}

export interface BuyingEndEvent extends BaseEvent {
    eventType: EventType.BuyingEnd,
    payload: {}
}

export interface CardPlayedEvent extends BaseEvent {
    eventType: EventType.CardPlayed
    payload: {
        card: Card
        playerId: string
        nextPlayerId: string | null
    }
}

export interface NewTrickEvent extends BaseEvent {
    eventType: EventType.NewTrick
    payload: {
        startPlayerId: string
    }
}

export interface TrickEndEvent extends BaseEvent {
    eventType: EventType.TrickEnd
    payload: {
        winningPlayerId: string
    }
}

export type Event = CardPlayedEvent | NewTrickEvent | TrickEndEvent | NewPlayerEvent | NewRoundEvent | PlayerReadyEvent
    | RoundEndEvent | BetPlacedEvent | BettingEndEvent | TrumpSuitChosenEvent | CardsBoughtEvent | BuyingEndEvent

export interface EventMap {
    [EventType.NewTrick]: NewTrickEvent
    [EventType.BetPlaced]: BetPlacedEvent
    [EventType.BettingEnd]: BettingEndEvent
    [EventType.TrumpSuitChosen]: TrumpSuitChosenEvent
    [EventType.CardsBought]: CardsBoughtEvent
    [EventType.BuyingEnd]: BuyingEndEvent
    [EventType.CardPlayed]: CardPlayedEvent
    [EventType.TrickEnd]: TrickEndEvent
    [EventType.NewPlayer]: NewPlayerEvent
    [EventType.NewRound]: NewRoundEvent
    [EventType.PlayerReady]: PlayerReadyEvent
    [EventType.RoundEnd]: RoundEndEvent
}
