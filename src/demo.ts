import { resolve } from 'node:path'

import { PlayerRef } from './lib/minecraft/events/players'

import { mcrx } from "."

export default async (): Promise<void> => {
    const {playerJoined, playerLeft} = mcrx(resolve('.'))

    const activePlayers = new Map<string, Partial<PlayerRef>>([])

    playerJoined(v => (activePlayers.set(v.player.id || 'dummy', v.player)))
    playerLeft(v => (activePlayers.delete(v.player.id || 'dummy')))

    playerJoined(v => console.log(`Player joined: ${v.player.name}`))
    playerLeft(v => console.log(`Player left: ${v.player.name}`))
}