import {GameModel} from "../GameModel";
import {Bet, GamePhase, RoundPhase} from "../../shared/PlayerGameState";
import {UserError} from "../UserError";
import {getPlayerByToken} from "../gameUtils";
import {eventBus} from "../eventBus";
import {getNextPlayer} from "./getNextPlayer";
import {EventType} from "../../shared/Event";
import assert from "assert";


export function placeBet(game: GameModel, playerToken: string, value: number | null) {
    if (game.phase !== GamePhase.Started) {
        throw new UserError('Game has not yet started or is already finished')
    }
    if (!game.round || game.round.phase !== RoundPhase.Betting) {
        throw new UserError('Round is not in the "Betting" phase')
    }

    const player = getPlayerByToken(game, playerToken);

    if (game.round.currentPlayerId !== player.id) {
        throw new UserError(`It is not player ${player.name}'s turn`)
    }

    if (game.round.bets.some(b => b.playerId === player.id)) {
        throw new UserError(`Player ${player.name} did already place a bet`)
    }

    if (value !== null && (value < 1 || value > 5)) {
        throw new UserError(`Bet value out of range: ${value}`)
    }

    const bets = game.round.bets;
    const highestBet = getHighestBet(bets)?.value || 0;

    if (value !== null && value <= highestBet) {
        throw new UserError('Bet must be higher than the currently highest one')
    }

    const isLastPlayer = bets.length + 1 >= game.players.length;
    if (highestBet === 0 && value === 1 && !isLastPlayer) {
        throw new UserError('Only the last player can bet with a value of 1')
    }

    bets.push({
        value,
        playerId: player.id
    })
    const nextPlayerId = isLastPlayer ? null : getNextPlayer(player, game).id;
    game.round.currentPlayerId = nextPlayerId
    eventBus.trigger(game, {
        eventType: EventType.BetPlaced,
        payload: {
            playerId: player.id,
            value,
            nextPlayerId: nextPlayerId
        }
    })

    if (isLastPlayer) {
       finishBetting(game)
    }

}

function finishBetting(game: GameModel) {
    assert(game.round)
    const highestBet = getHighestBet(game.round?.bets)
    const winnerId = highestBet?.playerId || game.players[game.players.length - 1].id
    const betValue = highestBet?.value || 1

    game.round.currentPlayerId = winnerId
    eventBus.trigger(game, {
        eventType: EventType.BettingEnd,
        payload: {
            winnerId,
            betValue
        }
    })
}

export function getHighestBet(bets: Bet[]): Bet | null {
    let highestBet: Bet | null = null
    bets.forEach(bet => {
        if (bet.value !== null && bet.value > (highestBet?.value || 0)) {
            highestBet = bet
        }
    })
    return highestBet
}
