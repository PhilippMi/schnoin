import {Card, Suit} from "./Card";


export enum EventType {
    NewTrick = 'newtrick',
    CardPlayed = 'cardplayed',
    TrickEnd = 'trickend',
    NewPlayer = 'newplayer',
    PlayerReady = 'playerready',
    NewRound = 'newround',
    RoundEnd = 'roundend'
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
        trumpSuit: Suit
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

export type Event = CardPlayedEvent | NewTrickEvent | TrickEndEvent | NewPlayerEvent | NewRoundEvent | PlayerReadyEvent | RoundEndEvent

export interface EventMap {
    [EventType.NewTrick]: NewTrickEvent
    [EventType.CardPlayed]: CardPlayedEvent
    [EventType.TrickEnd]: TrickEndEvent
    [EventType.NewPlayer]: NewPlayerEvent
    [EventType.NewRound]: NewRoundEvent
    [EventType.PlayerReady]: PlayerReadyEvent
    [EventType.RoundEnd]: RoundEndEvent
}
