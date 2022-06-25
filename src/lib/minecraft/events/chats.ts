/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { createUuid } from "../../common";

import { ChatEvent, ChatEvent$, ChatEventStreams, ChatEventType, MinecraftEventStreamer } from "./types";
import { StreamsBuilder } from "./utils";

export const messageSent$Key = 'messageSent$'

export class ChatEventStreamsBuilder<O=ChatEventStreams> extends StreamsBuilder<ChatEventType, ChatEvent$, O> {
    defineEvent (type: ChatEventType, key: string) {
        const result = this.streamer.matchMap$<ChatEvent>('type', type, v => ({
            timestamp: v.line.timestamp,
            message: {
                id: createUuid(v.line.id),
                timestamp: v.line.timestamp,
                author: v.data.author,
                content: v.data.content,
            }
        } as ChatEvent))

        return this.with(key, result)
    }
}

export const buildChatStreams$ = (streamer: MinecraftEventStreamer): ChatEventStreams => 
    new ChatEventStreamsBuilder(streamer)
    .add('messageSent', messageSent$Key)
    .done()