import Scene from './scene'
import * as readline from 'readline'

export default class SceneRender extends Scene{    

    rl: readline.ReadLine

    constructor( lines?: number, columns?: number ){        
        super( lines, columns )
        let output = process.stdout
        let input = process.stdin
        let rl = this.rl = readline.createInterface({
            input,
            output
        })
        input.on( 'keypress', ( ch: any, key: any ) => {
            let permitted = [ 'left', 'up', 'right', 'down', 'space' ]            
            if( permitted.indexOf( key.name ) >= 0 ){
                this.emit( 'keypress', key.name )
            }else{
                readline.moveCursor( output, -1 , 0 )
                readline.clearScreenDown( output )
            }
        })
        output.on( 'resize', () => {
            if( output.rows * 2 < this.lines || output.columns * 2 < this.columns ){
                process.exit( 0 )
            }else{
                this.render()
            }
        })
    }

    putCoor( coors: number[][] ): void{
        super.putCoor( coors )
        coors.forEach( coor => {
            let line = coor[1]
            if( this.isLineFulled(  line ) ){
                this.clearLine( line )
            }
        })
        this.render()
    }

    render(): void{
        let coors = this.coors
        let str = ''
        let rl = this.rl
        let output = rl.output
        let x = ( output.columns - this.columns * 2 ) / 2 | 0
        this.renderBorder()
        coors.forEach( ( coor, index ) => {
            readline.cursorTo( rl.output, x, index + 1 )
            str = ''
            coor.forEach( flag => {
                str += flag ? '囗' : '  '
            })
            rl.write( str + '\n' )
        })
        readline.moveCursor( output, -x, 2 )
    }

    renderBorder(){
        let rl = this.rl
        let output = rl.output
        let x = ( output.columns - this.columns * 2 - 2 ) / 2 | 0
        readline.cursorTo( output, 0, 0 )
        readline.clearScreenDown( output )
        readline.cursorTo( output, x, 0 )
        rl.write( '┌' + '─'.repeat( this.columns ) + '┐' )
        let i: number
        for( i=0;i<this.lines;i++ ){
            readline.cursorTo( output, x, i + 1 )
            rl.write( '│' + '  '.repeat( this.columns ) + '│\n' )
        }
        readline.cursorTo( output, x, i + 1 )
        rl.write( '└' + '─'.repeat( this.columns ) + '┘' )
    }

    renderCoors( coors: number[][], str: string = '囗' ): void{
        let rl = this.rl
        let output = rl.output
        let x = ( output.columns - this.columns * 2 ) / 2 | 0
        coors.forEach( coor => {
            if( coor[1] < 0 ){
                return
            }
            readline.cursorTo( output, x + coor[0] * 2, coor[1] + 1 )
            output.write( str )
        })
        readline.cursorTo( output, 0, this.lines + 3 )
    }

    clearCoors( coors: number[][] ): void{
        this.renderCoors( coors, '  ' )
    }

}