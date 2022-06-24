/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */

import { MinecraftEventStreamer } from "./types"

export abstract class StreamsBuilder<T,I,O> {
    state: Record<string, I>
    streamer: MinecraftEventStreamer
    define$: (v: T) => I;

    constructor(streamer: MinecraftEventStreamer) {
        this.streamer = streamer

        this.state = {}
    }

    with(key: string, result: I) {
        this.state[key] = result

        return this
    }

    add(value: T, key: string) {
       return this.defineEvent(value, key)
    }

    done(): O {
        return this.state as unknown as O
    }

    abstract defineEvent(type: T, key: string): this
}