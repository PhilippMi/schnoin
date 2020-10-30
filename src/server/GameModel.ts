import {Deck} from "./Deck";
import {Card} from "../shared/Card";
import {Player} from "../shared/PlayerGameSate";

type Trick = {
    playerId: string
    card: Card
}[];

export interface GameModel {
    trick: Trick;
    id: string
    deck: Deck
    players: Player[]
}
