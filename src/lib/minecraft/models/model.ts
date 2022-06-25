export type Model<T, K extends ModelKey<T>> = Partial<T> & K

export type ModelKey<T> = {
    readonly pk: keyof T
    readonly id: T[keyof T]
}