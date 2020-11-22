import {eventBus} from "./eventBus";
import {GameModel} from "./GameModel";
import {Event} from "../shared/Event";

const eventsMap: Map<GameModel, Event[]> = new Map<GameModel, Event[]>()

export function startEventStore() {
    eventBus.register(undefined, undefined, (event, game) => {
        const events = getEventsForGame(game)
        events.push(event);
        eventsMap.set(game, events)
    })
}

export function getEventsForGame(game: GameModel): Event[] {
    return eventsMap.get(game) || []
}
