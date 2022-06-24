/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-mixed-type */
import { join, normalize, resolve } from 'node:path'

import { map, Observable, Subscriber } from 'rxjs'

import { streamLoggedEvents$ } from './events'
import { streamLogs$ } from "./logs"
import { buildPlayerStreams$ } from './players'
import { buildServerStreams$ } from './servers'
import { LogLine$, MinecraftEventStreamer, PlayerEventStreams, ServerEventStreams } from './types'

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

export type World$ = {
    readonly files$: MinecraftFiles
    readonly logs$: LogLine$
    readonly loggedEvents$: MinecraftEventStreamer
    readonly serverEvents$: ServerEventStreams
    readonly playerEvents$: PlayerEventStreams
}

export const prepareWorldStream$ = (callback: ((subscriber: Subscriber<string>) => void)): Observable<World$> => {
    const $rootDir = new Observable<string>(
        subscriber => {
            callback(subscriber)
        })
    
    $rootDir.subscribe(v => console.log(`new rootDir: ${v}`))

    return $rootDir.pipe(map(v => streamWorldDirectory$(v))) as Observable<World$>
}

export const createWorldStream$ = (rootDir$: Observable<string>, callback: (world$: World$) => void) => rootDir$.subscribe(rootDir => callback(streamWorldDirectory$(rootDir)))

export const streamWorldDirectory$ = (rootDir: string): World$ => {
    const files$ = useMinecraftFiles(rootDir)

    const logs$ = streamLogs$(files$.latestLogs)
    const loggedEvents$ = streamLoggedEvents$(logs$)

    const serverEvents$ = buildServerStreams$(loggedEvents$)
    const playerEvents$ = buildPlayerStreams$(loggedEvents$)

    return {
        files$,
        logs$,
        loggedEvents$,
        serverEvents$,
        playerEvents$,
    }
}