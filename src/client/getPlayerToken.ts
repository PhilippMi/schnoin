import {v4 as uuid} from 'uuid'

let playerToken: string | undefined

export function getPlayerToken() {
    if (!playerToken) {
        playerToken = localStorage.getItem('schnoin.player-token') || undefined
        if (!playerToken) {
            playerToken = uuid()
            try {
                localStorage.setItem('schnoin.player-token', playerToken)
            } catch(e) {
                console.error('could not set player token in local storage', e)
            }
        }
    }
    return playerToken
}
