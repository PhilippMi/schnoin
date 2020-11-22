import {Opponent, Player, PlayerGameState} from "../shared/PlayerGameSate";
import {CardPlayedEvent, Event, EventType, NewTrickEvent, TrickEndEvent} from "../shared/Event";
import {isSameCard} from "../shared/cardUtils";

export function processEvent(state: PlayerGameState, event: Event) {
    switch (event.eventType) {
        case EventType.CardPlayed:
            cardPlayed(state, event)
            break
        case EventType.TrickEnd:
            trickEnd(state, event)
            break
        case EventType.NewTrick:
            newTrick(state, event)
            break
    }
}

function isOpponent(player: Player | Opponent): player is Opponent {
    return typeof (player as Opponent).nCards === 'number';
}

function cardPlayed(state: PlayerGameState, event: CardPlayedEvent) {
    const {card, playerId, nextPlayerId} = event.payload
    const player = getPlayerById(state, playerId)
    if (isOpponent(player)) {
        player.nCards--
    } else {
        player.cards = player.cards.filter(c => !isSameCard(c, card))
    }
    state.trick.cards.push({ card, playerId })
    state.trick.currentPlayerId = nextPlayerId
}

function newTrick(state: PlayerGameState, event: NewTrickEvent) {
    const {startPlayerId} = event.payload
    state.trick = { currentPlayerId: startPlayerId, cards: []}
}

function trickEnd(state: PlayerGameState, event: TrickEndEvent) {
    const {winningPlayerId} = event.payload
    const winningPlayer = getPlayerById(state, winningPlayerId)
    winningPlayer.tricksWon++
    state.trick.cards = []
    state.trick.currentPlayerId = null
}

function getPlayerById(state: PlayerGameState, id: string): Player | Opponent {
    const player = (state.opponents as (Opponent | Player)[]).concat(state.player).find(p => p.id === id)
    if (!player) {
        throw new Error(`unknown player ${id}`)
    }
    return player
}
