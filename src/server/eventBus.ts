import {Event, EventMap, EventType} from "../shared/Event";
import {GameModel} from "./GameModel";
import {v4 as uuid} from 'uuid';

interface Listener {
    game?: GameModel
    eventType?: EventType
    callback: (payload: any, game: GameModel) => void
}

let listeners: Listener[] = [];

export const eventBus = {

    register<K extends keyof EventMap>(game: GameModel | undefined, eventType: K | undefined, callback: (event: EventMap[K], game: GameModel) => void) {
        listeners.push({game, eventType, callback})
    },

    trigger(game: GameModel, event: Omit<Event, 'id'>) {
        const fullEvent = Object.assign({id: uuid()}, event)
        listeners
            .filter(l => (!l.eventType || l.eventType === event.eventType) && (!l.game || l.game === game))
            .forEach(l => l.callback(fullEvent, game))
    },

    deregister(callback: Function) {
        listeners = listeners.filter(l => l.callback !== callback)
    },

    deregisterAll(game: GameModel) {
        listeners = listeners.filter(l => l.game !== game)
    }

}
