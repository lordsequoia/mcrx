/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import {
    MinecraftEventStreamer,
    PlayerEvent,
    PlayerEvent$,
    PlayerEventStreams,
    PlayerEventType,
} from "./types";
import { StreamsBuilder } from "./utils";

export const playerJoined$Key = 'playerJoined$'
export const playerLeft$Key = 'playerLeft$'
export const playerConnected$Key = 'playerConnected$'
export const playerDisconnected$Key = 'playerDisconnected$'

export class PlayerStreamsBuilder<O=PlayerEventStreams> extends StreamsBuilder<PlayerEventType, PlayerEvent$, O> {
    defineEvent (type: PlayerEventType, key: string) {
        const result = this.streamer.matchMap$<PlayerEvent>('type', type, v => ({
            timestamp: v.line.timestamp,
            player: {
                name: v.data.name 
            }
        } as PlayerEvent))

        return this.with(key, result)
    }
}

export const buildPlayerStreams$ = (streamer: MinecraftEventStreamer): PlayerEventStreams => 
    new PlayerStreamsBuilder<PlayerEventStreams>(streamer)
        .add('playerConnect', playerConnected$Key)
        .add('playerDisconnect', playerDisconnected$Key)
        .add('playerJoin', playerJoined$Key)
        .add('playerLeave', playerLeft$Key)
        .done()