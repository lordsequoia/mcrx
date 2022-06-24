import { join } from 'node:path'
import { Observable } from 'rxjs'

import { MinecraftEvent, useEventsStream } from './events'
import { PlayerEvent, usePlayerEventStreams } from './events/players'
import { useServerEventStreams } from './events/servers'
import { useLogsStream } from './logs'

export const createContext = (rootDir: string) => {
    const {logsStream$: logs$} = useLogsStream(join(rootDir, './logs/latest.log'))

    const eventStreamer = useEventsStream(logs$)
    const {stream$: events$} = eventStreamer
    
    const serverEvents = useServerEventStreams(eventStreamer)
    const playerEvents = usePlayerEventStreams(eventStreamer)

    return {logs$, events$, serverEvents, playerEvents}
}

export type UseWorld = {
    readonly rootDir: string;
}
export const useWorld = (options: UseWorld) => {
    const ctx = createContext(options.rootDir)

    const on$ = <T>(event: Observable<T>, callback: (v: T) => void | Promise<void>) => event.subscribe(v => callback(v))


    const playerJoined$ = (callback: (event: PlayerEvent) => void | Promise<void>) => on$(ctx.playerEvents.join$, callback)

    return {
        on$,
        playerJoined$,
    }
}