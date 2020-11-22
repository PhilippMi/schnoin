import {Card} from "./Card";


export enum EventType {
    NewTrick,
    CardPlayed,
    TrickEnd
}


export interface BaseEvent {
    eventType: EventType
    payload: object
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

export type Event = CardPlayedEvent | NewTrickEvent | TrickEndEvent

export interface EventMap {
    [EventType.NewTrick]: NewTrickEvent
    [EventType.CardPlayed]: CardPlayedEvent
    [EventType.TrickEnd]: TrickEndEvent
}
