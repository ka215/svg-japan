import 'babel-polyfill'
import './index.scss'
import svgJapan from './_core-class'

window.svgJapan = ( ...args ) => {
    let opts = args.length > 0 ? args[0] : null
    return new svgJapan( opts )
}
