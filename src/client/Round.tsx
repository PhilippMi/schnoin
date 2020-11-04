import "./round.scss"
import {PlayerGameState} from "../shared/PlayerGameSate";
import React from "react";
import {CardView} from "./CardView";
import {Trick} from "./Trick";
import {Card} from "../shared/Card";
import {HiddenHand} from "./HiddenHand";

interface RoundProps {
    state: PlayerGameState,
    onSelectCard: (card: Card) => void
}

export function Round(props: RoundProps) {
    const cardItems = props.state.player.cards.map(c =>
        <button className="round__card" key={`${c.suit}.${c.rank}`} onClick={() => selectCard(c)}>
            <CardView card={c}/>
        </button>
    )
    const opponents = props.state.opponents.map((o, i) =>
        <div className={`round__opponent round__opponent--${i + 1}`}>
            <div className={`round__opponent-hand`}>
                <HiddenHand nCards={o.nCards} />
            </div>
        </div>
    )
    return <div className="round">
        <div className="round__my-hand">
            {cardItems}
        </div>
        {opponents}
        <div className="round__trick">
            <Trick trick={props.state.trick} />
        </div>
    </div>

    function selectCard(card: Card) {
        props.onSelectCard(card)
    }
}

