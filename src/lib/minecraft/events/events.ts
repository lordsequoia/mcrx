/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */

import { useStream } from "../../common";

import { MINECRAFT_EVENTS } from "./constants";
import { LogLine, LogLine$, MinecraftEvent } from "./types";

export const mapMinecraftEventData = (groups: readonly string[], keys: readonly string[]) => {
    const result: Record<string, string> = {}

    for (const idx of keys.keys()) {
        const key = keys[idx]
        result[key] = `${groups[idx]}`
    }
    
    return result
}

export const parseMinecraftEvent = (line: LogLine): MinecraftEvent => {
    for (const [pattern, definition] of MINECRAFT_EVENTS) {
        const result = pattern.exec(line.content)

        if (result !== undefined && result !== null) {
            return {
                line,
                type: definition.type,
                data: mapMinecraftEventData(result.slice(1, result.length), definition.args)
            }
        }
    }

    return { line, type: 'raw', data: {}}
}

export const streamLoggedEvents$ = (source: LogLine$) => {
    const transform$ = useStream<MinecraftEvent, LogLine>

    return transform$(source, parseMinecraftEvent)
}
