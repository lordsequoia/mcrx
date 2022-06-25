/* eslint-disable functional/no-mixed-type */
import { join, normalize, resolve } from 'node:path'

import { buildChatStreams$ } from './chats'
import { streamLoggedEvents$ } from './events'
import { streamLogs$ } from './logs'
import { buildPlayerStreams$ } from './players'
import { buildServerStreams$ } from './servers'
import {
    ChatEventStreams,
    LogLine$,
    MinecraftEventStreamer,
    PlayerEventStreams,
    ServerEventStreams
} from './types'

export type World = {

}

export type MinecraftFiles = {
    readonly cwd: string;
    readonly createPath: (path?: string) => string
    readonly latestLogs: string
}

export const useMinecraftFiles = (rootDir?: string): MinecraftFiles => {
    const cwd = normalize(rootDir || resolve('.'))

    const createPath = (path?: string) => {
        return path === undefined ? cwd : join(cwd, path)
    }

    const latestLogs = createPath(join('logs', 'latest.log'))

    return {cwd, createPath, latestLogs }
}

export type MinecraftWorld$ = {
    readonly files$: MinecraftFiles
    readonly logs$: LogLine$
    readonly loggedEvents$: MinecraftEventStreamer
    readonly serverEvents$: ServerEventStreams
    readonly playerEvents$: PlayerEventStreams
    readonly chatEvents$: ChatEventStreams
}

export const streamWorldDirectory$ = (rootDir: string): MinecraftWorld$ => {
    const files$ = useMinecraftFiles(rootDir)

    const logs$ = streamLogs$(files$.latestLogs)
    const loggedEvents$ = streamLoggedEvents$(logs$)

    const serverEvents$ = buildServerStreams$(loggedEvents$)
    const playerEvents$ = buildPlayerStreams$(loggedEvents$)
    const chatEvents$ = buildChatStreams$(loggedEvents$)

    return {
        files$,
        logs$,
        loggedEvents$,
        serverEvents$,
        playerEvents$,
        chatEvents$,
    }
}