import { Observable } from "rxjs"

import { Streamer } from "../../common"

import { LoggedEvent, MinecraftEvent, MinecraftEventType } from "."

export type ServerEvent = LoggedEvent<MinecraftEventType>
export type ServerStart = ServerEvent
export type ServerStop = ServerEvent
export type ServerCrash = ServerEvent

export type ServerEventStreams = {
    readonly start$: Observable<ServerStart>
    readonly stop$: Observable<ServerStop>
    readonly crash$: Observable<ServerCrash>
}


export const useServerEventStreams = (streamer: Streamer<MinecraftEvent>): {
    readonly start$: Observable<ServerStart>
    readonly stop$: Observable<ServerStop>
    readonly crash$: Observable<ServerCrash>
} => {
    const defineServerEvent = (type: MinecraftEventType) => streamer.matchMap$('type', type, v => ({timestamp: v.line.timestamp}))

    return {
        start$: defineServerEvent('serverStart') as Observable<ServerStart>,
        stop$: defineServerEvent('serverStop') as Observable<ServerStop>,
        crash$: defineServerEvent('serverCrash') as Observable<ServerCrash>,
    }
}