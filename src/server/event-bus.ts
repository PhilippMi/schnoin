
export enum Event {
    CardPlayed,
    NewTrick
}


interface Listener {
    game: object
    eventName: Event
    callback: () => void
}

let listeners: Listener[] = [];

export const eventBus = {

    register(game: object, eventName: Event, callback: () => void) {
        listeners.push({game, eventName, callback})
    },

    trigger(game: object, eventName: Event) {
        listeners
            .filter(l => l.eventName === eventName && l.game === game)
            .forEach(l => l.callback())
    },

    deregister(callback: () => void) {
        listeners = listeners.filter(l => l.callback !== callback)
    },

    deregisterAll(game: object) {
        listeners = listeners.filter(l => l.game !== game)
    }

}
