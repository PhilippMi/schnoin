import React, {ChangeEvent} from "react";

interface MenuProps {
    gameId: string
    playerName: string
    onGameIdChanged: (gameId: string) => void
    onPlayerNameChanged: (playerName: string) => void
    onJoin: () => void
}

export function MainMenu(props: MenuProps) {
    return (
        <menu>
            <label>Your Name:</label>
            <input type="text" onChange={(e: ChangeEvent) => props.onPlayerNameChanged((e.target as HTMLInputElement).value)}/>
            <label>Game ID:</label>
            <input type="text" onChange={(e: ChangeEvent) => props.onGameIdChanged((e.target as HTMLInputElement).value)}/>
            <button onClick={() => props.onJoin()}>Join Game</button>
        </menu>
    )
}
