import { RequireAtLeastOne } from "type-fest";

import { Model, ModelKey } from "./model";

export type PlayerData = {
    readonly SpawnX: number;
};

export type PlayerShape = {
    readonly id: string;
    readonly name: string;
    readonly data: PlayerData;
};

export type PlayerModelKey = ModelKey<PlayerShape>
export type Player = Model<PlayerShape, PlayerModelKey>


export const player$ = (key: RequireAtLeastOne<{
    readonly id: string;
    readonly name: string; 
}>) => {
    const model = {
        id: key.id,
        name: key.name,
        data: {
            SpawnX: 12,
        }
    } as Player

    return model
}