import { MinecraftEventDefinition } from "./types";

export const MINECRAFT_EVENTS = new Map<RegExp, MinecraftEventDefinition>([
    [/(.*) joined the game/, { type: 'playerJoin', args: ['name'] }],
    [/(.*) left the game/, { type: 'playerLeave', args: ['name'] }],
])