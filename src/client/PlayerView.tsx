import './player.scss';
import React, {PropsWithChildren} from "react";

export interface PlayerViewProps {
    score: number | string
    name: string
    active: boolean
}

export function PlayerView(props: PropsWithChildren<PlayerViewProps>) {
    return <div className={`player ${props.active ? 'player--active' : ''}`}>
        <div className="player__hand">
            {props.children}
        </div>
        <div className="player__name">{props.name}</div>
        <div className="player__score">{props.score}</div>
    </div>
}
