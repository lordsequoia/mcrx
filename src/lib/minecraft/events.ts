/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { Observable } from "rxjs";

import { Streamer, StreamFilter, StreamShaper, useStream } from "../common/streams";

import { LogLine } from ".";

export type MinecraftEventType = 
    | 'raw' 
    | 'playerJoin' 
    | 'playerLeave' 
    | 'playerConnect' 
    | 'playerDisconnect' 
    | 'serverStart' 
    | 'serverStop' 
    | 'serverCrash' 
    | 'chatMessage'

export type MinecraftEvent<T=string> = {
    readonly line: LogLine;
    readonly type: MinecraftEventType;
    readonly data: Record<string, T>
}

export type MinecraftEventDefinition = {
    readonly type: MinecraftEventType;
    readonly args: readonly string[];
}

export const MINECRAFT_EVENTS = new Map<RegExp, MinecraftEventDefinition>([
    [/(.*) joined the game/, { type: 'playerJoin', args: ['name'] }],
    [/(.*) left the game/, { type: 'playerLeave', args: ['name'] }],
])

export const mapMinecraftEventData = (groups: readonly string[], keys: readonly string[]) => {
    const result: Record<string, string> = {}

    for (const [key, index] of keys) {
        result[key] = `${groups[index]}`
    }
    
    return result
}

export const parseMinecraftEvent = (line: LogLine): MinecraftEvent => {
    for (const [pattern, definition] of MINECRAFT_EVENTS) {
        const result = pattern.exec(line.content)

        if (result !== undefined && result !== null && result.length === definition.args.length) {
            return {
                line,
                type: definition.type,
                data: mapMinecraftEventData(result, definition.args)
            }
        }
    }

    return { line, type: 'raw', data: {}}
}

export type MinecraftEventKey = keyof MinecraftEvent
export type MinecraftEventValue = MinecraftEvent[MinecraftEventKey]
export type MinecraftEventFilter = StreamFilter<MinecraftEvent>
export type MinecraftEventShaper<T> = StreamShaper<MinecraftEvent, T>

export const useEventsStream = (logsStream: Observable<LogLine>) => useStream<MinecraftEvent, LogLine>(logsStream, parseMinecraftEvent)

export type MinecraftEventStream<T = MinecraftEvent> = Observable<T>

export type ServerEvent<T extends MinecraftEventType, S=undefined> = {
    readonly timestamp: string;
    readonly type: T;
} & S

export type PlayerRef = {
    readonly id: string;
    readonly name: string;
}

export type PlayerEvent = ServerEvent<MinecraftEventType, { readonly player: Partial<PlayerRef> }>
export type PlayerJoin = PlayerEvent
export type PlayerLeave = PlayerEvent

export type ServerEventStreams = {
    readonly playerJoins: MinecraftEventStream<PlayerJoin>;
    readonly playerLeaves: MinecraftEventStream<PlayerLeave>;
}

export const useServerEventStreams = (streamer: Streamer<MinecraftEvent>): ServerEventStreams => {
    const { matchMap$ } = streamer

    const defineEvent = <T>(type: MinecraftEventValue, shape: StreamShaper<MinecraftEvent, T>) => matchMap$('type', type, shape)

    const definePlayerEvent = (type: MinecraftEventType) => defineEvent<PlayerEvent>(type, (v: MinecraftEvent<string>): PlayerEvent => {
        return {
            timestamp: v.line.timestamp,
            type,
            player: v.data as PlayerRef,
        }
    })

    const playerLeaves = definePlayerEvent('playerLeave')
    const playerJoins = definePlayerEvent('playerJoin')

    
    return {playerLeaves, playerJoins}
}