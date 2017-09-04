import { 
    Shape,
    SHAPE_TYPES,
    createShape
} from './shapes/index'
import DIRECTION from './direction'

export default class Block<T>{

    elements: T[]

    shape: Shape

    private position: number[] = [ 0, 0 ]

    coors: number[][]

    private static index: number = 0

    constructor( type: Shape | SHAPE_TYPES, elems: T[], position?: number[] ){
        let elm: HTMLElement
        this.shape = createShape( type )
        this.elements = []
        Block.index++
        elems.forEach( elem => {
            this.elements.push( elem )
        })
        if( position ){
            this.position = position
        }
        this.coors = this.getCoordinate()
    }

    getHorizontalBlocks(): number{
        let coor = this.shape.coordinate
        return <number>coor.reduce( ( prev, item ) => {
            Array.isArray( item )
            let res = Array.isArray( item ) ? item.length : 1
            return res > prev ? res : prev
        }, 1 )
    }

    getVerticalBlocks(): number{
        let coor = this.shape.coordinate
        return coor.length
    }

    getCoordinate( coordinate?: ( number | number[])[], position?: number[] ): number[][]{
        let elems = this.elements
        let coors: number[][] = []
        let nums: number[]

        if( !position ){
            position = this.position
        }
        if( !coordinate ){
            coordinate = this.shape.coordinate
        }
        for( let i=0;i<coordinate.length;i++ ){
            nums = <number[]>(Array.isArray( coordinate[i] ) ? coordinate[i] : [ coordinate[i] ])
            for( let j=0;j<nums.length;j++ ){
                if( nums[j] ){
                    coors.push( [ j + position[0], i + position[1] ] )
                }
            }
        }
        return coors
    }

    operate( direction: DIRECTION ): void {
        if( direction == DIRECTION.UP ){
            this.shape.rotate()
            this.coors = this.getCoordinate()
            return
        }
        this.coors = this.blockOperate( direction )
    }

    rotate( n?: number ): void{
         this.shape.rotate( n )
         this.coors = this.getCoordinate()
    }

    blockOperate( direction: DIRECTION ): number[][]{
        let coors = this.coors
        if( direction == DIRECTION.UP ){
            let initCoor = this.getCoordinate( this.shape.coordinate, [ 0, 0 ] )[0]
            let currentCoor = coors[0]
            let position = [ currentCoor[0] - initCoor[0], currentCoor[1] - initCoor[1] ]
            let shape = createShape( this.shape )
            shape.rotate()
            return this.getCoordinate( shape.coordinate, position )
        }
        let _coors: number[][] = []
        let _coor: number[] = []
        for( let coor of coors ){
            _coor = coor.slice()
            if( direction == DIRECTION.LEFT ){
                _coor[0] -= 1
            }else if( direction == DIRECTION.RIGHT ){
                _coor[0] += 1
            }else if( direction == DIRECTION.DOWN ){
                _coor[1] += 1
            }
            _coors.push( _coor )
        }
        return _coors
    }

    destroy(): void{
        this.shape = null
        this.elements = null
        this.coors = null
        this.position = null
    }
    
}
