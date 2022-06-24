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