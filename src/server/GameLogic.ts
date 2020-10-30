import {GameModel} from "./GameModel"
import {Card} from "../shared/Card"
import {UserError} from "./UserError"

export function playCard(game: GameModel, playerId: string, card: Card) {
    const player = game.players.find(p => p.id === playerId)
    if (!player) {
        throw new UserError(`cannot find player ${playerId} for game ${game.id}`)
    }
    const cardIndex = player.cards.findIndex(c => c.suit === card.suit && c.rank === card.rank)
    if (cardIndex === -1) {
        throw new UserError('Cannot play card the user does not possess')
    }
    player.cards.splice(cardIndex, 1);
    game.trick.push({
        playerId,
        card
    });
}
