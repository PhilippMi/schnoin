import './main-menu.scss';
import React, {ChangeEvent} from "react";

interface MenuProps {
    gameId: string
    playerName: string
    onGameIdChanged: (gameId: string) => void
    onRefreshGameId: () => void
    onPlayerNameChanged: (playerName: string) => void
    onJoin: () => void
}

export function MainMenu(props: MenuProps) {
    return (
        <menu className='main-menu'>
            <label className='main-menu__label'>Your Name:</label>
            <input className='main-menu__input' type="text" value={props.playerName}
                   onChange={(e: ChangeEvent) => props.onPlayerNameChanged((e.target as HTMLInputElement).value)}/>
            <label className='main-menu__label'>Game ID:</label>
            <div className='main-menu__input'>
                <input className='main-menu__input-field' type="text" value={props.gameId}
                       onChange={(e: ChangeEvent) => props.onGameIdChanged((e.target as HTMLInputElement).value)}/>
                <button className='main-menu__input-button'
                        onClick={() => props.onRefreshGameId()}>↻</button>
            </div>
            <button className='main-menu__button'
                    onClick={() => props.onJoin()}>Join Game</button>
        </menu>
    )
}
