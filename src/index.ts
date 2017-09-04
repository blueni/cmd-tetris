/// <reference path="./node.expand.d.ts" />

import Block from './block'
import SceneRender from './scene-render'
import KEYCODE from './keycode'
import DIRECTION from './direction'
import * as readline from 'readline'
import * as fs from 'fs'

type CmdBlock = Block<undefined>

export default class CmdTetris{

    scene: SceneRender

    currentBlock: CmdBlock

    nextBlock: CmdBlock

    timer: NodeJS.Timer
    
    level: number = 0

    constructor(){
        let scene = this.scene = new SceneRender( 20, 10 )
        scene.clear()
        scene.render()
    }

    start(){        
        this.next()
        this.keyBinding()        
    }
    
    falldown(): void{
        let speed = this.getSpeed()
        let block = this.currentBlock
        let scene = this.scene
        let coors: number[][]
        let nextCoors: number[][]
        clearInterval( this.timer )
        this.timer = setInterval( () => {
            nextCoors = block.blockOperate( DIRECTION.DOWN )
            if( scene.hitCheck( nextCoors ) ){
                clearInterval( this.timer )
                if( !coors ){
                    console.log( 'game is over...' )
                    return 
                }
                scene.putCoor( block.coors )
                this.next()
                return
            }else{
                coors = nextCoors
                block.coors = coors
                scene.renderCoors( block.coors )
            }
        }, speed )
    }

    next(): void{
        this.createBlock()
        this.falldown()
    }
    
    keyBinding(): void{
        let scene = this.scene
        let input = scene.rl.input
        let output = scene.rl.output

        const _gameOperate = ( type: string ): void => {
            let block = this.currentBlock
            let coors: number[][]
            switch( type ){                                
                case 'left':    // left                    
                    coors = block.blockOperate( DIRECTION.LEFT )
                    break

                case 'up':    // rotate
                    coors = block.blockOperate( DIRECTION.UP )
                    break
                    
                case 'right':    // right
                    coors = block.blockOperate( DIRECTION.RIGHT )
                    break
                    
                case 'down':    // down
                    coors = block.blockOperate( DIRECTION.DOWN )
                    break

                case 'space':    // space
                    let _coors = block.blockOperate( DIRECTION.DOWN )
                    while( !this.scene.hitCheck( _coors ) ){
                        coors = _coors
                        block.coors = coors
                        _coors = block.blockOperate( DIRECTION.DOWN )
                    }
                    if( coors ){
                        scene.putCoor( coors )
                        this.next()
                        return
                    }
                    break

                default:
                    return
            }
            if( !scene.hitCheck( coors ) ){
                scene.clearCoors( block.coors )
                block.coors = coors
                scene.renderCoors( coors )

                if( type == 'up' ){
                    block.shape.rotate()
                }
            }
        }

        scene.on( 'keypress', ( type: string ): void => {
            _gameOperate( type )
        })
    }

    getSpeed(): number{
        return [ 200, 180, 160, 140, 120, 100, 80 ][this.level]
    }
    
    createBlock(): void{
        let random = Math.floor( Math.random() * 5 )

        const _createBlock = (): CmdBlock => {
            return <CmdBlock>new Block( Math.floor( Math.random() * 7 ), [ Math.floor( this.scene.columns / 2 ) - 2, -4 ] )
        }  

        let nextBlock: CmdBlock = _createBlock()
        nextBlock.rotate( random )

        if( this.nextBlock ){
            this.currentBlock = this.nextBlock
            this.nextBlock = nextBlock
        }else{
            this.currentBlock = nextBlock
            this.nextBlock = _createBlock()
            this.nextBlock.rotate( random )
        }
        let currentBlock = this.currentBlock
        this.scene.renderCoors( currentBlock.getCoordinate() )
    }

}

let game = new CmdTetris()
game.start()