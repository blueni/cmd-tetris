declare interface String{
    [key: string]: any
}

declare module 'readline'{
    import * as tty from 'tty'

    export interface ReadLine{
        input: tty.ReadStream
        output: tty.WriteStream
    }

    export function emitKeypressEvents( stream: NodeJS.ReadableStream, rl?: ReadLine ): void

}