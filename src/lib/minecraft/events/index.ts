/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { Observable } from "rxjs";

import { StreamFilter, StreamShaper, useStream } from "../../common/streams";
import { LogLine } from "../logs";

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

export type MinecraftEventStream<T = MinecraftEvent> = Observable<T>

export type LoggedEvent<T extends MinecraftEventType, S=undefined> = {
    readonly timestamp: string;
    readonly type?: T;
} & S

export const useEventsStream = (logsStream: Observable<LogLine>) => useStream<MinecraftEvent, LogLine>(logsStream, parseMinecraftEvent)
