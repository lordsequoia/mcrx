import { Streamer } from "../../common"

import {
    MinecraftEvent,
    MinecraftEventStreamer,
    MinecraftEventType,
    ServerCrash,
    ServerEvent,
    ServerEventStreams,
    ServerStart,
    ServerStop
} from "./types"

export const defineServerEvent$ = <T extends ServerEvent>(type: MinecraftEventType, streamer: MinecraftEventStreamer) => 
    streamer.matchMap$('type', type, v => ({timestamp: v.line.timestamp} as T))

export const createServerEventStream$ = (streamer: Streamer<MinecraftEvent>): ServerEventStreams => {

    const defineEvent$ = <T extends ServerEvent>(type: MinecraftEventType) => defineServerEvent$<T>(type, streamer)

    return {
        defineEvent$,
        start$: defineEvent$<ServerStart>('serverStart'),
        stop$: defineEvent$<ServerStop>('serverStop'),
        crash$: defineEvent$<ServerCrash>('serverCrash'),
    }
}