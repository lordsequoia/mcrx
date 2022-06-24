import { Observable } from "rxjs";

import {
    MinecraftEventStreamer,
    MinecraftEventType,
    PlayerEvent,
    PlayerEventType,
    PlayerJoin,
    PlayerLeave
} from "./types";

export const definePlayerEvent$ = <S extends PlayerEventType, T extends PlayerEvent<S>>(type: MinecraftEventType, streamer: MinecraftEventStreamer): Observable<T> => 
    streamer.matchMap$('type', type, v => ({
        type,
        timestamp: v.line.timestamp,
        player: {
            name: v.data.name 
        }
    } as T))

export const usePlayerEventStream$ = (streamer: MinecraftEventStreamer): PlayerEventStreams => {

    const defineEvent$ = <S extends PlayerEventType, T extends PlayerEvent<S>>(type: MinecraftEventType) => definePlayerEvent$<S, T>(type, streamer)

    const playerJoined$ = defineEvent$<'playerJoin', PlayerJoin>('playerJoin')
    const playerLeft$ = defineEvent$<'playerLeave', PlayerLeave>('playerLeave')

    return {
        defineEvent$,
        playerJoined$,
        playerLeft$
    }
}