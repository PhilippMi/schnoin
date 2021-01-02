import "./round.scss"
import {Player, PlayerGameState, Round, RoundPhase} from "../shared/PlayerGameState";
import React from "react";
import {CardView} from "./CardView";
import {Trick} from "./Trick";
import {Card} from "../shared/Card";
import {HiddenHand} from "./HiddenHand";
import {PlayerView} from "./PlayerView";
import {TrumpSuitIcon} from "./TrumpSuitIcon";

interface RoundProps {
    state: PlayerGameState,
    onSelectCard: (card: Card) => void
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

export function Round(props: RoundProps) {
    const cardItems = props.state.player.cards.map(c =>
        <button className="round__card" key={`${c.suit}.${c.rank}`} onClick={() => selectCard(c)}>
            <CardView card={c}/>
        </button>
    )
    const opponents = props.state.opponents.map((o, i) =>
        <div className={`round__opponent round__opponent--${i + 1}`} key={i}>
            {o && <PlayerView score={getScore(props.state.round, o)} name={o.name}>
                <div className={`round__opponent-hand`}>
                    <HiddenHand nCards={o.nCards} rotated={i % 2 === 0}/>
                </div>
            </PlayerView>}
        </div>
    )
    const playerIds = [props.state.player.id, ...props.state.opponents.map(o => o?.id)]
    const trumpSuit = props.state.round?.trumpSuit;
    return <div className="round">
        {typeof trumpSuit === 'number' && <div className="round__trump-suit">
            <TrumpSuitIcon trumpSuit={trumpSuit} />
        </div>}
        <div className="round__player">
            <PlayerView score={getScore(props.state.round, props.state.player)} name={props.state.player.name}>
                <div className="round__player-cards">
                    {cardItems}
                </div>
            </PlayerView>
        </div>
        {opponents}
        {props.state.round?.trick && <div className="round__trick">
            <Trick trick={props.state.round?.trick} playerIds={playerIds} />
        </div>}
    </div>

    function selectCard(card: Card) {
        props.onSelectCard(card)
    }
}

