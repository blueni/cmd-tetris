import * as events from 'events'

export default class Scene extends events.EventEmitter{

    lines: number = 20

    columns: number = 10

    coors: number[][]

    constructor( lines?: number, columns?: number ){
        super()
        if( lines > 20 ){
            this.lines = lines
        }
        if( columns > 10 ){
            this.columns = columns
        }
        this.init()
    }

    isLineFulled( line: number ): boolean{
        let flags = this.coors[line]
        if( !flags ){
            throw new Error( 'line is out of coordinates' )
        }
        for( let flag of flags ){
            if( !flag ){
                return false
            }
        }
        return true
    }

    hitCheck( coors: number[][] ): boolean{
        if( !coors ){
            return false
        }
        for( let coor of coors ){
            // 撞墙了~
            if( coor[0] < 0 || coor[0] > this.columns - 1 || coor[1] > this.lines - 1 ){
                return true
            }
            // 此坑已被占~
            if( coor[1] >= 0 && this.coors[coor[1]][coor[0]] ){
                return true
            }
        }
        return false
    }

    putCoor( coors: number[][] ): void{        
        if( this.hitCheck( coors ) ){
            throw new Error( 'block can not put here' )
        }
        for( let coor of coors ){
            this.coors[coor[1]][coor[0]] = 1
        }
    }

    init(): void{
        this.coors = []
        let coors: number[]
        for( let i = 0;i<this.lines;i++ ){
            coors = []
            for( let j=0;j<this.columns;j++ ){
                coors.push( 0 )
            }
            this.coors.push( coors )
        }
    }

    clear(): void{
        for( let i = 0;i<this.lines;i++ ){
            this.clearLine( i )
        }
    }

    clearLine( line: number ): void{
        let coors = this.coors[line]
        if( !coors ){
            throw new Error( 'line is out of coordinates' )
        }
        coors = coors.map( ( flag: number ) => 0 )
        this.coors.splice( line, 1 )
        this.coors.unshift( coors )
    }

}
