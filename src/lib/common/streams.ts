import { filter, map, Observable } from "rxjs";

export type StreamFilter<T> = (v: T) => boolean;
export type StreamShaper<T,S> = (v: T) => S;

export type Streamer<T> = {
    readonly stream$: Observable<T>,
    
    readonly subset$: (include: StreamFilter<T>) => Observable<T>
    readonly match$: (key: keyof T, value: T[keyof T]) => Observable<T>

    readonly mapSubset$: <S>(include: StreamFilter<T>, shape: StreamShaper<T, S>) => Observable<S>
    readonly matchMap$: <S>(key: keyof T, value: T[keyof T], shape: StreamShaper<T, S>) => Observable<S>
}

export const useStream = <T, V=T>(source: Observable<V>, parse: (v: V) => T): Streamer<T> => {
    const stream$ = source.pipe(map(v => parse(v)))

    const subset$ = (include: StreamFilter<T>) => stream$.pipe(filter<T>(v => include(v)))
    const mapSubset$ = <S>(include: StreamFilter<T>, shape: StreamShaper<T, S>) => subset$(include).pipe(map<T, S>(v => shape(v)))
    
    const match$ = (key: keyof T, value: T[keyof T]) => subset$(v => v[key] === value)
    const matchMap$ = <S>(key: keyof T, value: T[keyof T], shape: StreamShaper<T,S>) => mapSubset$<S>(v => v[key] === value, shape)

    return {stream$, subset$, match$, mapSubset$, matchMap$}
}