import { map } from "rxjs";

import { file$ } from "../common/files";

export type RawLogLine = string

export type LogTimestamp = string
export type LogLevel = 
    | 'INFO' 
    | 'ERROR' 
    | 'FATAL' 
    | 'WARN'

export type LogLine = {
    readonly timestamp: LogTimestamp;
    readonly channel: string;
    readonly level: LogLevel;
    readonly content: string;
}

export const serverLogRegex = /\[(.*)\] \[(.*)\/(.*)\]: (.*)/m

export const parseLog = (value: RawLogLine): LogLine => {
    const parsed = serverLogRegex.exec(value)
  
    if (parsed === undefined || parsed === null || parsed.length < 4) {
        return {timestamp: 'unknown', channel: 'unknown', 'level': 'WARN', content: value}
    }
  
    return {
      timestamp: parsed[1],
      channel: parsed[2],
      level: parsed[3] as LogLevel,
      content: parsed[4],
    }
  }

export const useLogsStream = (path: string) => {
    const {rawStream} = file$(path)

    const logsStream$ = rawStream.pipe(map(v => parseLog(v)))
    
    return {logsStream$}
}