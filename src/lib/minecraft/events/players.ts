import { Observable } from "rxjs";

import { Streamer } from "../../common";

import { LoggedEvent, MinecraftEvent, MinecraftEventStream, MinecraftEventType } from ".";

export type PlayerRef = {
    readonly id: string;
    readonly name: string;
}

export type PlayerExtractor = (v: MinecraftEvent) => {
    readonly timestamp: string;
    readonly player: {
        readonly name: string;
    }
}

export type PlayerEvent = LoggedEvent<MinecraftEventType, { readonly player: Partial<PlayerRef> }>
export type PlayerJoin = PlayerEvent
export type PlayerLeave = PlayerEvent

export type PlayerEventStreams = {
    readonly playerJoins$: MinecraftEventStream<PlayerJoin>;
    readonly playerLeaves$: MinecraftEventStream<PlayerLeave>;
}

export const usePlayerEventStreams = (streamer: Streamer<MinecraftEvent>): {
    readonly join$: Observable<PlayerJoin>;
    readonly leave$: Observable<PlayerLeave>;
} => {
    const definePlayerEvent = (type: MinecraftEventType) => streamer.matchMap$('type', type, v => ({
        type,
        timestamp: v.line.timestamp,
        player: {
            name: v.data.name 
        }
    }))

    return {
        leave$: definePlayerEvent('playerLeave') as Observable<PlayerLeave>,
        join$: definePlayerEvent('playerJoin') as Observable<PlayerJoin>,
    }
}