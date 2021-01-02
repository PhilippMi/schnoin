import {Opponent, PlayerGameState, RoundPhase, User} from "../shared/PlayerGameState";
import {
    BetPlacedEvent, BettingEndEvent,
    CardPlayedEvent,
    Event,
    EventType,
    NewPlayerEvent,
    NewTrickEvent,
    PlayerReadyEvent,
    TrickEndEvent
} from "../shared/Event";
import {isSameCard} from "../shared/cardUtils";
import {getOpponentIndexForPlayer} from "../shared/playerUtils";
import {assert} from "./assert";

export async function processEvent(state: PlayerGameState, event: Event): Promise<number> {
    switch (event.eventType) {
        case EventType.NewPlayer:
            newPlayer(state, event)
            return 0
        case EventType.PlayerReady:
            playerReady(state, event)
            return 0
        case EventType.BetPlaced:
            await betPlaced(state, event)
            return 0
        case EventType.BettingEnd:
            bettingEnd(state, event)
            return 0
        case EventType.NewRound:
            await newRound(state)
            return 0
        case EventType.CardPlayed:
            cardPlayed(state, event)
            if (state.round?.trick?.cards.length === state.opponents.length + 1) {
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

function placeBet(state: PlayerGameState) {
    if (state.player.id === state.round?.currentPlayerId) {
        fetch(`/api/game/${state.id}/bet`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value: state.player.index === 0 ? 5 : null
            })
        })
            .catch(console.error)
    }
}

async function newRound(state: PlayerGameState) {
    const newState = await fetchGameState(state.id)
    Object.assign(state, newState)
    // temporary
    await placeBet(state)
}

function bettingEnd(state: PlayerGameState, event: BettingEndEvent) {
    assert(state.round)
    state.round.phase = RoundPhase.Play
    state.round.currentPlayerId = event.payload.winnerId
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

async function betPlaced(state: PlayerGameState, event: BetPlacedEvent) {
    assert(state.round)
    state.round.bets.push({
        value: event.payload.value,
        playerId: event.payload.playerId
    })
    state.round.currentPlayerId = event.payload.nextPlayerId
    await placeBet(state)
}

function playerReady(state: PlayerGameState, event: PlayerReadyEvent) {
    const player = getPlayerById(state, event.payload.playerId);
    player.ready = true;
}

function cardPlayed(state: PlayerGameState, event: CardPlayedEvent) {
    assert(state.round)
    assert(state.round.trick)
    const {card, playerId, nextPlayerId} = event.payload
    const player = getPlayerById(state, playerId)
    if (isOpponent(player)) {
        player.nCards--
    } else {
        player.cards = player.cards.filter(c => !isSameCard(c, card))
    }
    state.round.trick.cards.push({ card, playerId })
    state.round.currentPlayerId = nextPlayerId
}

function newTrick(state: PlayerGameState, event: NewTrickEvent) {
    assert(state.round)
    const {startPlayerId} = event.payload
    state.round.currentPlayerId = startPlayerId
    state.round.trick = { cards: []}
}

function trickEnd(state: PlayerGameState, event: TrickEndEvent) {
    assert(state.round)
    assert(state.round.trick)
    const {winningPlayerId} = event.payload
    const winningPlayer = getPlayerById(state, winningPlayerId)
    winningPlayer.tricksWon++
    state.round.trick.cards = []
    state.round.currentPlayerId = null
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
