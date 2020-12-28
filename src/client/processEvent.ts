import {Opponent, User, PlayerGameState} from "../shared/PlayerGameState";
import {CardPlayedEvent, Event, EventType, NewPlayerEvent, NewTrickEvent, PlayerReadyEvent, TrickEndEvent} from "../shared/Event";
import {isSameCard} from "../shared/cardUtils";
import {getOpponentIndexForPlayer} from "../shared/playerUtils";

export async function processEvent(state: PlayerGameState, event: Event): Promise<number> {
    switch (event.eventType) {
        case EventType.NewPlayer:
            newPlayer(state, event)
            return 0
        case EventType.PlayerReady:
            playerReady(state, event)
            return 0
        case EventType.NewRound:
            await newRound(state)
            return 0
        case EventType.CardPlayed:
            cardPlayed(state, event)
            if (state.trick.cards.length === state.opponents.length + 1) {
                return 1000
            }
            return 500
        case EventType.TrickEnd:
            trickEnd(state, event)
            return 500
        case EventType.NewTrick:
            newTrick(state, event)
            return 0
    }
    return 0
}

function isOpponent(player: User | Opponent): player is Opponent {
    return typeof (player as Opponent).nCards === 'number';
}

async function newRound(state: PlayerGameState) {
    const newState = await fetchGameState(state.id)
    Object.assign(state, newState)
}

function newPlayer(state: PlayerGameState, event: NewPlayerEvent) {
    const index = getOpponentIndexForPlayer(state.player.index, event.payload.index)
    state.opponents[index] = {
        id: event.payload.id,
        name: event.payload.name,
        index: event.payload.index,
        tricksWon: 0,
        nCards: 0,
        ready: false
    }
}

function playerReady(state: PlayerGameState, event: PlayerReadyEvent) {
    const player = getPlayerById(state, event.payload.playerId);
    player.ready = true;
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

function getPlayerById(state: PlayerGameState, id: string): User | Opponent {
    const player = ([] as (Opponent | User | null)[]).concat(state.opponents).concat(state.player).find(p => p?.id === id)
    if (!player) {
        throw new Error(`unknown player ${id}`)
    }
    return player
}

export async function fetchGameState(gameId: string): Promise<PlayerGameState> {
    const endpoint = `/api/game/${gameId}`;

    const response = await fetch(endpoint)
    return response.json()
}
