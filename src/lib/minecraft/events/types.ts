import { Observable } from "rxjs"
import { RequireAtLeastOne } from "type-fest"

import { Streamer, StreamFilter, StreamShaper } from "../../common"

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

export type LogLine$ = Observable<LogLine>

export type MiscEventType = 'raw'
export type ChatEventType = 'receiveMessage'
export type PlayerEventType = 'playerEvent' | 'playerJoin' | 'playerLeave' | 'playerConnect' | 'playerDisconnect'
export type ServerEventType = 'serverStart' | 'serverStop' | 'serverCrash'

export type MinecraftEventType = MiscEventType | ChatEventType | PlayerEventType | ServerEventType

export type MinecraftEvent = {
    readonly line: LogLine;
    readonly type: MinecraftEventType;
    readonly data: Record<string, string>
}

export type MinecraftEvent$ = Observable<MinecraftEvent>

export type MinecraftEventDefinition = {
    readonly type: MinecraftEventType;
    readonly args: readonly string[];
}

export type MinecraftEventKey = keyof MinecraftEvent
export type MinecraftEventValue = MinecraftEvent[MinecraftEventKey]
export type MinecraftEventFilter = StreamFilter<MinecraftEvent>
export type MinecraftEventShaper<T> = StreamShaper<MinecraftEvent, T>

export type MinecraftEventStream<T = MinecraftEvent> = Observable<T>
export type MinecraftEventStreamer<T = MinecraftEvent> = Streamer<T>

export type LoggedEvent<T=undefined> = {
    readonly timestamp: string;
} & T

export type ServerRef = {
    readonly id: string;
    readonly path: string;
}

export type ServerEventData = {
    readonly server: Partial<ServerRef>
}

export type ServerEvent = LoggedEvent<ServerEventData>
export type ServerEvent$ = Observable<ServerEvent>

export type ServerEventStreams = {
    readonly serverStarted$: ServerEvent$
    readonly serverStopped$: ServerEvent$
    readonly serverCrashed$: ServerEvent$
}

export type PlayerRef = {
    readonly id: string;
    readonly name: string;
}

export type PlayerExtractor = (v: MinecraftEvent) => {
    readonly timestamp: string;
    readonly player: RequireAtLeastOne<PlayerRef>
}

export type PlayerEventData = {
    readonly player: RequireAtLeastOne<PlayerRef> 
}

export type PlayerEvent = LoggedEvent<PlayerEventData>
export type PlayerEvent$ = Observable<PlayerEvent>

export type PlayerEventStreams = {
    readonly playerConnected$: PlayerEvent$;
    readonly playerDisconnected$: PlayerEvent$;
    readonly playerJoined$: PlayerEvent$;
    readonly playerLeft$: PlayerEvent$;
}