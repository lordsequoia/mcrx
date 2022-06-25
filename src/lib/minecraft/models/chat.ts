import { Player } from "./player";

export type ChatMessage = {
    readonly id: number
    readonly timestamp: string
    readonly author: string
    readonly content: string

    readonly player: Player
};