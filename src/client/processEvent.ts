import {Opponent, Player, PlayerGameState} from "../shared/PlayerGameState";
import {CardPlayedEvent, Event, EventType, NewPlayerEvent, NewTrickEvent, PlayerReadyEvent, TrickEndEvent} from "../shared/Event";
import {isSameCard} from "../shared/cardUtils";
import {getPlayerToken} from "./getPlayerToken";

export async function processEvent(state: PlayerGameState, event: Event) {
    switch (event.eventType) {
        case EventType.NewPlayer:
            newPlayer(state, event)
            break
        case EventType.PlayerReady:
            playerReady(state, event)
            break
        case EventType.NewRound:
            await newRound(state)
            break
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

async function newRound(state: PlayerGameState) {
    const newState = await fetchGameState(state.id)
    Object.assign(state, newState)
}

function newPlayer(state: PlayerGameState, event: NewPlayerEvent) {
    state.opponents.push({
        id: event.payload.id,
        name: event.payload.name,
        tricksWon: 0,
        nCards: 0,
        ready: false
    })
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

function getPlayerById(state: PlayerGameState, id: string): Player | Opponent {
    const player = (state.opponents as (Opponent | Player)[]).concat(state.player).find(p => p.id === id)
    if (!player) {
        throw new Error(`unknown player ${id}`)
    }
    return player
}

export async function fetchGameState(gameId: string): Promise<PlayerGameState> {
    const endpoint = `/api/game/${gameId}?token=${getPlayerToken()}`;

    const response = await fetch(endpoint)
    return response.json()
}
