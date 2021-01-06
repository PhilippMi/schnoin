import './action-overlay.scss';
import React from "react";
import {GamePhase, PlayerGameState, RoundPhase} from "../shared/PlayerGameState";
import {Suit} from "../shared/Card";
import {TrumpSuitIcon} from "./TrumpSuitIcon";

interface ActionOverlayProps {
    game: PlayerGameState
    ready: boolean
    onReady: () => void
    nSelectedCards: number
    buyCards: () => void
    placeBet: (value: number | null) => void
    chooseTrumpSuit: (suit: Suit) => void
}

export function ActionOverlay(props: ActionOverlayProps) {
    const game = props.game
    const isLobby = game?.gamePhase === GamePhase.Created
    const bettingPhase = game?.round?.phase === RoundPhase.Betting && game.round.currentPlayerId === game.player.id
    const allBetsPlaced = game.round?.bets.length === game.opponents.length + 1
    const awaitingCardExchange = game?.round?.phase === RoundPhase.Buying && game.round.currentPlayerId === game.player.id

    const awaitingBet = bettingPhase && !allBetsPlaced
    const chooseTrumpSuit = bettingPhase && allBetsPlaced

    const buttons: {label: string | JSX.Element; onClick: () => void}[] = []
    if (isLobby) {
        if (!props.ready) {
            buttons.push({
                label: 'Bereit',
                onClick: () => props.onReady()
            })
        }
    } else if (awaitingBet) {
        for(let i = 0; i <= 5; i++) {
            buttons.push({
                label: i === 0 ? 'weida' : i.toString(),
                onClick: () => props.placeBet(i === 0 ? null : i)
            })
        }
    } else if (chooseTrumpSuit) {
        buttons.push(...[Suit.Acorns, Suit.Bells, Suit.Hearts, Suit.Leaves]
            .map(suit => ({
                label: <TrumpSuitIcon trumpSuit={suit}/>,
                onClick: () => props.chooseTrumpSuit(suit)
            }))
        )
    } else if (awaitingCardExchange) {
        buttons.push({
            label: props.nSelectedCards === 1 ? '1 Karte austauschen' : `${props.nSelectedCards} Karten austauschen`,
            onClick: () => props.buyCards()
        })
    } else {
        return null
    }

    return <div className={`action-overlay ${awaitingCardExchange ? 'action-overlay--transparent' : ''}`}>
        {buttons.map((b, i) =>
            <div className="action-overlay__button" key={i}>
                <button onClick={b.onClick}>{b.label}</button>
            </div>
        )}
    </div>
}
