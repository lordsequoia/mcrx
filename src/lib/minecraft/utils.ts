/* export const createContext = (rootDir: string) => {
    const {logsStream$: logs$} = useLogsStream(join(rootDir, './logs/latest.log'))

    const eventStreamer = useEventsStream(logs$)
    const {stream$: events$} = eventStreamer
    
    const serverEvents = useServerEventStreams(eventStreamer)
    const playerEvents = usePlayerEventStream$(eventStreamer)

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
    
    const playerConnected = when$<PlayerEvent>(ctx.playerEvents)

    const serverStarted = when$<ServerEvent>(ctx.serverEvents.start$)
    const serverStopped = when$<ServerEvent>(ctx.serverEvents.stop$)
    const serverCrashed = when$<ServerEvent>(ctx.serverEvents.crash$)

    return Object.assign(ctx, {
        on$,
        when$,
        events: {
            playerJoined,
            playerLeft,
            serverStarted,
            serverStopped,
            serverCrashed,
        }
    })
}

export const streamMinecraftWorld$ = (options: Partial<{readonly rootDir: string}>) => {
    const {rawStream} = buildLogStreams(join(options.rootDir || resolve('.'), 'logs', 'latest.log'))
    const {logsStream} = stream
    const loggedEventStreamer = streamLoggedEvents$(rawStream)
} */

export const foobar = () => console.log(`foo: ${'bar'}`)