import { Observable } from "rxjs"
import { Tail } from "tail"

export const tail$ = (path: string) => new Observable<string>(subscriber => {
    const tail = new Tail(path, {follow: true})

    tail.on('line', line => subscriber.next(line))
    tail.on('error', error => subscriber.error(error))
})

export const file$ = (path: string) => {
    const rawStream = tail$(path)
    
    return {rawStream}
}