import { map } from "rxjs";

import { createUuid } from "../../common";
import { file$ } from "../../common/files";

import { LogLevel, LogLine, RawLogLine } from "./types";

export const serverLogRegex = /\[(.*)\] \[(.*)\/(.*)\]: (.*)/m

export const parseLog = (value: RawLogLine): LogLine => {
    const parsed = serverLogRegex.exec(value)

    const id = createUuid(JSON.stringify(value))
  
    if (parsed === undefined || parsed === null || parsed.length < 4) {
        return {id, timestamp: 'unknown', channel: 'unknown', 'level': 'WARN', content: value}
    }
  
    return {
      id,
      timestamp: parsed[1],
      channel: parsed[2],
      level: parsed[3] as LogLevel,
      content: parsed[4],
    }
  }

export const buildLogStreams$ = (path: string) => {
    const {rawStream} = file$(path)

    const logsStream$ = rawStream.pipe(map(v => parseLog(v)))
    
    return {rawStream, logsStream$}
}

export const streamLogs$ = (path: string) => buildLogStreams$(path).logsStream$