import { join } from 'node:path'
import { Observable } from 'rxjs'

import { MinecraftEvent, useEventsStream } from './events/utils'
import { PlayerEvent, usePlayerEventStreams } from './events/players'
import { ServerEvent, useServerEventStreams } from './events/servers'
import { useLogsStream } from './events/logs'

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

    const on$ = <T>(event: Observable<T>, callback: (v: T) => unknown) => event.subscribe(v => callback(v))
    const when$ = <T>(event: Observable<T>) => (callback: (v: T) => unknown) => on$(event, callback) 

    const playerJoined = when$<PlayerEvent>(ctx.playerEvents.join$)
    const playerLeft = when$<PlayerEvent>(ctx.playerEvents.leave$)

    const serverStarted = when$<ServerEvent>(ctx.serverEvents.start$)
    const serverStopped = when$<ServerEvent>(ctx.serverEvents.stop$)
    const serverCrashed = when$<ServerEvent>(ctx.serverEvents.crash$)

    return {
        on$,
        playerJoined,
        playerLeft,
        serverStarted,
        serverStopped,
        serverCrashed,
    }
}