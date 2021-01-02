import './player.scss';
import React, {PropsWithChildren} from "react";

export interface PlayerViewProps {
    score: number | string
    name: string
}

export function PlayerView(props: PropsWithChildren<PlayerViewProps>) {
    return <div className="player">
        <div className="player__hand">
            {props.children}
        </div>
        <div className="player__name">{props.name}</div>
        <div className="player__score">{props.score}</div>
    </div>
}
