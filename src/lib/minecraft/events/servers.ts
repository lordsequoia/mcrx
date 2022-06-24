/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { Streamer } from "../../common"

import {
    MinecraftEvent,
    ServerEvent,
    ServerEvent$,
    ServerEventStreams,
    ServerEventType,
} from "./types"
import { StreamsBuilder } from "./utils"

export const serverStarted$Key = 'serverStarted$'
export const serverStopped$Key = 'serverStopped$'
export const serverCrashed$Key = 'serverCrashed$'

export class ServerStreamsBuilder<O=ServerEventStreams> extends StreamsBuilder<ServerEventType, ServerEvent$, O> {
    defineEvent (type: ServerEventType, key: string) {
        const result = this.streamer.matchMap$<ServerEvent>('type', type,
            v => ({timestamp: v.line.timestamp} as ServerEvent)
        )

        return this.with(key, result)
    }
}

export const buildServerStreams$ = (streamer: Streamer<MinecraftEvent>): ServerEventStreams => 
    new ServerStreamsBuilder(streamer)
        .add('serverStart', serverStarted$Key)
        .add('serverStop', serverStopped$Key)
        .add('serverCrash', serverCrashed$Key)
        .done()