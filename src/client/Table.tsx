import "./table.scss"
import {Player, PlayerGameState, Round, RoundPhase} from "../shared/PlayerGameState";
import React from "react";
import {Trick} from "./Trick";
import {Card} from "../shared/Card";
import {HiddenHand} from "./HiddenHand";
import {PlayerView} from "./PlayerView";
import {TrumpSuitIcon} from "./TrumpSuitIcon";
import PlayerHand from "./PlayerHand";

interface TableProps {
    state: PlayerGameState,
    onSelectCard: (card: Card) => void
    selectedCards: Set<Card>
}

function getScore(round: Round | undefined, o: Player): number | string {
    if (round?.phase === RoundPhase.Betting) {
        const bet = round.bets.find(b => b.playerId === o.id)
        if (bet) {
            return bet.value || 'weida'
        }
        return ''
    }
    return o.tricksWon;
}

export function Table(props: TableProps) {
    const round = props.state.round;
    const player = props.state.player;

    const opponents = props.state.opponents.map((o, i) =>
        <div className={`table__opponent table__opponent--${i + 1}`} key={i}>
            {o && <PlayerView
                score={getScore(round, o)}
                name={o.name}
                active={round?.currentPlayerId === o.id}
            >
                <HiddenHand nCards={o.nCards} rotated={i % 2 === 0}/>
            </PlayerView>}
        </div>
    )
    const playerIds = [player.id, ...props.state.opponents.map(o => o?.id)]
    const trumpSuit = round?.trumpSuit;
    return <div className="table">
        {typeof trumpSuit === 'number' && <div className="table__trump-suit">
            <TrumpSuitIcon trumpSuit={trumpSuit} />
        </div>}
        <div className="table__player">
            <PlayerView
                score={getScore(round, player)}
                name={player.name}
                active={round?.currentPlayerId === player.id}
            >
                <PlayerHand cards={player.cards} onSelectCard={props.onSelectCard} selectedCards={props.selectedCards} />
            </PlayerView>
        </div>
        {opponents}
        {round?.trick && <div className="table__trick">
            <Trick trick={round?.trick} playerIds={playerIds} />
        </div>}
    </div>

}

