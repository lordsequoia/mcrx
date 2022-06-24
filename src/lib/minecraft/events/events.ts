/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { Observable } from "rxjs";

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

export const streamMinecraftEvents = (logsStream: Observable<LogLine>) => useStream<MinecraftEvent, LogLine>(logsStream, parseMinecraftEvent)
