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

export type MiscEventType = 'raw'
export type ChatEventType = 'receiveMessage'
export type PlayerEventType = 'playerEvent' | 'playerJoin' | 'playerLeave' | 'playerConnect' | 'playerDisconnect'
export type ServerEventType = 'serverStart' | 'serverStop' | 'serverCrash'

export type MinecraftEventType = MiscEventType | ChatEventType | PlayerEventType | ServerEventType

export type MinecraftEvent<T=string> = {
    readonly line: LogLine;
    readonly type: MinecraftEventType;
    readonly data: Record<string, T>
}

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

export type LoggedEvent<T extends MinecraftEventType, S=undefined> = {
    readonly timestamp: string;
    readonly type?: T;
} & S

export type ServerRef = {
    readonly id: string;
    readonly path: string;
}

export type ServerEvent = LoggedEvent<MinecraftEventType, {
    readonly server: RequireAtLeastOne<ServerRef>;
}>
export type ServerStart = ServerEvent
export type ServerStop = ServerEvent
export type ServerCrash = ServerEvent

export type ServerEventStreams = {
    readonly defineEvent$: ()
    readonly start$: Observable<ServerStart>
    readonly stop$: Observable<ServerStop>
    readonly crash$: Observable<ServerCrash>
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

export type PlayerEvent<T extends PlayerEventType> = LoggedEvent<T, PlayerEventData>

export type PlayerJoin = PlayerEvent<'playerJoin'>
export type PlayerLeave = PlayerEvent<'playerLeave'>

export type PlayerEvent$<S extends PlayerEventType, T extends PlayerEvent<S>> = Observable<T>

export type PlayerJoined$ = PlayerEvent$<'playerJoin', PlayerJoin>
export type PlayerLeft$ = PlayerEvent$<'playerLeave', PlayerLeave>

export type PlayerEventStreams = {
    readonly defineEvent$: <S extends PlayerEventType, T extends PlayerEvent<S>>(type: PlayerEventType) => Observable<T>;
    readonly playerJoined$: PlayerJoined$;
    readonly playerLeft$: PlayerLeft$;
}