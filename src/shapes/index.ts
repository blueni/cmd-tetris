import {
    Shape,
    S,
    Z,
    L,
    J,
    T,
    O,
    I
} from './shape'

const enum SHAPE_TYPES {
    S, Z, L, J, T, O, I
}

const createShape = <T extends Shape>( type: SHAPE_TYPES | T ): T => {
    if( type instanceof Shape ){
        return <T>type.clone( type )
    }
    let shape: T
    shape = <T>new [ S, Z, L, J, T, O, I ][ type ]
    shape.coordinate = shape.allShapes[0]
    shape.shapeIndex = 0
    return shape
}

export {
    Shape,
    SHAPE_TYPES,
    createShape
}