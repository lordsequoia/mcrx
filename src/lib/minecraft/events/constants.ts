import { MinecraftEventDefinition } from "./types";

export const MINECRAFT_EVENTS = new Map<RegExp, MinecraftEventDefinition>([
    [/<(.*)> (.*)/m, { type: 'messageSent', args: ['author', 'content']}],
    [/(.*) joined the game/m, { type: 'playerJoin', args: ['name'] }],
    [/(.*) left the game/m, { type: 'playerLeave', args: ['name'] }],
])