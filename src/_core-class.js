import { isObject, isElement, extend, hasProp, logger } from './_utils.js'
import { attributes, drawData } from './_prefectures.js'
import { Defaults, Regions } from './_defaults.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

class svgJapan {
    constructor( ...args ) {
        if ( args[0] && isObject( args[0] ) ) {
            this.opts = extend( Defaults, args[0] )
        } else {
            this.opts = Defaults
        }
        this.svg_atts = attributes
        this.svg_data = drawData
        this.regions  = Regions
        this.map_container = null

        this.init()

        return this
    }

    init() {
        if ( hasProp( 'element', this.opts ) ) {
            let targetElm = document.querySelector( this.opts.element )
            if ( targetElm ) {
                this.map_container = targetElm
            } else {
                logger('The container element does not exist.')
                return false
            }
        } else {
            this.map_container = document.createElement('div')
        }
        if ( this.map_container && isElement( this.map_container ) ) {
            this.map_container.classList.add('svg-japan-container')
        }

        this.curX = 0
        this.curY = 0

        // Assign Event
        this.svgJapanEvent = new MouseEvent( 'svgmap.click', {
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0
        } )

//console.log( this.opts, this.svg_data, this.regions, this.map_container, this.curX, this.curY )
        this.createMap().then(() => {
            // logger( 'SVG-map initialization completed successfully.', 'info' )
        })
    }

    async createMap() {
        const map = await this._drawMap()

        let self = this

        // Bind Events
        Array.prototype.forEach.call(map.querySelectorAll('path'), (prefecture) => {
            prefecture.addEventListener('mouseout', (evt) => {
                if ( [ 'outline1','outline2' ].includes(evt.target.id) ) {
                    return false
                }
                let rId = parseInt(evt.target.getAttribute('data-region'), 10)
                if ( self.opts.regionality ) {
                    Array.prototype.forEach.call(evt.target.parentNode.childNodes, (elm) => {
                        if ( parseInt(elm.getAttribute('data-region'), 10) == rId ) {
                            elm.setAttributeNS(null, 'fill', elm.getAttribute('data-default'))
                        }
                    })
                }
                evt.target.setAttributeNS(null, 'fill', evt.target.getAttribute('data-default'))
                if ( evt.target.classList ) {
                    evt.target.classList.remove('active')
                } else {
                    // For ie11
                    let _cls = evt.target.getAttribute('class').split(' ')
                    if ( _cls.includes('active') ) {
                        evt.target.setAttribute('class', _cls.filter((v) => v !== 'active').join(' '))
                    }
                }
                self.showTips()
            }, false)
                prefecture.addEventListener('mouseover', (evt) => {
                if ( [ 'outline1','outline2' ].includes(evt.target.id) ) {
                    return false
                }
                let cId = parseInt(evt.target.id.replace('pref-', ''), 10),
                    rId = parseInt(evt.target.getAttribute('data-region'), 10),
                    hoverColor = this.opts.activeColor || '#D70035'
                if ( evt.target.classList ) {
                    evt.target.classList.add('active')
                } else {
                    // For ie11
                    let _cls = evt.target.getAttribute('class').split(' ')
                    if ( ! _cls.includes('active') ) {
                        _cls.push('active')
                        evt.target.setAttribute('class', _cls.join(' '))
                    }
                }
                evt.target.setAttributeNS(null, 'fill', hoverColor)
                if ( self.opts.regionality ) {
                    Array.prototype.forEach.call(evt.target.parentNode.childNodes, (elm) => {
                        if ( parseInt(elm.getAttribute('data-region'), 10) == rId && cId != parseInt( elm.id.replace('pref-', ''), 10 ) ) {
                            let _tmp = self.regions.find( ({ id }) => id == rId ),
                                activeRegionColor = _tmp ? _tmp.active : null
                            if ( self.opts.regions && self.opts.regions.length > 0 ) {
                                let _rg = self.opts.regions.find( ({ id }) => id == rId )
                                if ( _rg && hasProp( 'active', _rg ) ) {
                                    activeRegionColor = _rg.active
                                }
                            }
                            if ( activeRegionColor ) {
                                elm.setAttributeNS(null, 'fill', activeRegionColor)
                            }
                        }
                    })
                }
                self.showTips()
            }, false)
                prefecture.addEventListener('click', (evt) => {
                if ( [ 'outline1','outline2' ].includes(evt.target.id) ) {
                    return false
                }
                self.selectedMap(evt.target)
            }, false)
        })
    }

    _drawMap() {
        return new Promise((resolve) => {
            const svgElm = document.createElementNS(SVG_NAMESPACE, 'svg'),
                  mapType = [ 'full', 'dense', 'deform' ].includes( this.opts.type.toLowerCase() ) ? this.opts.type.toLowerCase() : 'full',
                  regionList = this.opts.regions || this.regions
            svgElm.setAttributeNS(null, 'version', '1.1')
            svgElm.setAttribute('xmlns', SVG_NAMESPACE)
            svgElm.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            //svgElm.setAttribute('xmlns:mapsvg', 'http://mapsvg.com')
            svgElm.setAttribute('id', `svg-japan-${mapType}`)
            svgElm.setAttributeNS(null, 'x', '0px')
            svgElm.setAttributeNS(null, 'y', '0px')
            svgElm.setAttributeNS(null, 'viewBox', this.svg_atts.viewBox[mapType])
            svgElm.setAttributeNS(null, 'enable-background', this.svg_atts.enableBackground[mapType])
            svgElm.setAttribute('xml:space', 'preserve')
            Object.keys(this.svg_data).forEach((key) => {
                let pathElm = document.createElementNS(SVG_NAMESPACE, 'path'),
                    regionId   = 0,
                    fillColor  = this.opts.uniformly && this.opts.uniformColor !== '' ? this.opts.uniformColor : this.svg_data[key].color[0],// The default is the individual color of each prefecture
                    _cr = regionList.find( ({ prefs }) => prefs.includes( this.svg_data[key].id ) )

                if ( _cr ) {
                    regionId = _cr.id
                }
                if ( this.opts.regionality && ! this.opts.uniformly ) {
                    let _tr = regionList.find( ({ id }) => id === regionId )
                    fillColor = _tr ? _tr.color : fillColor
                }
                if ( this.opts.prefColors && Object.keys(this.opts.prefColors).length > 0 ) {
                    if ( Object.keys(this.opts.prefColors).includes( key ) ) {
                        fillColor = this.opts.prefColors[key]
                    }
                }
//console.log( '_drawMap:', regionId, fillColor, Object.keys(this.opts.prefColors).length )

                pathElm.setAttributeNS(null, 'id', `pref-${this.svg_data[key].id}`)
                pathElm.setAttributeNS(null, 'data-region', regionId)
                pathElm.setAttributeNS(null, 'data-name', this.svg_data[key].name)
                pathElm.setAttributeNS(null, 'data-default', fillColor)
                pathElm.setAttributeNS(null, 'fill', fillColor)
                pathElm.setAttributeNS(null, 'stroke', 'none')
                pathElm.setAttributeNS(null, 'd', this.svg_data[key][mapType])
                if ( pathElm.classList ) {
                    pathElm.classList.add('prefecture-map')
                } else {
                    // For ie11
                    pathElm.setAttribute('class', 'prefecture-map')
                }
                svgElm.appendChild(pathElm)
            })
            let strokeLayer = document.createElementNS(SVG_NAMESPACE, 'g')

            strokeLayer.setAttributeNS(null, 'id', 'strokes')
            if ( this.opts.stroked ) {
                // draw outlines
                Object.keys(this.svg_atts.strokes).forEach((key) => {
                    if ( [ 'outline1', 'outline2' ].includes(key) ) {
                        let linePath = document.createElementNS(SVG_NAMESPACE, 'path'),
                            lineWidth = this.svg_atts.strokes[key].strokeWidth

                        if ( this.svg_atts.strokes[key].path[mapType] !== '' ) {
                            linePath.setAttributeNS(null, 'id', key)
                            linePath.setAttributeNS(null, 'fill', this.opts.strokeColor || this.svg_atts.strokes[key].stroke)
                            linePath.setAttributeNS(null, 'stroke', this.opts.strokeColor || this.svg_atts.strokes[key].stroke)
                            linePath.setAttributeNS(null, 'stroke-width', mapType === 'deform' ? 4.5 : lineWidth)
                            linePath.setAttributeNS(null, 'd', this.svg_atts.strokes[key].path[mapType])
                            strokeLayer.appendChild(linePath)
                        }
                    }
                })
            }
            if ( 'dense' === mapType ) {
                // draw divider
                let divPath = document.createElementNS(SVG_NAMESPACE, 'polyline')

                divPath.setAttributeNS(null, 'id', 'divider')
                divPath.setAttributeNS(null, 'fill', 'none')
                divPath.setAttributeNS(null, 'stroke', this.svg_atts.strokes.divider.stroke)
                divPath.setAttributeNS(null, 'stroke-width', this.svg_atts.strokes.divider.strokeWidth)
                divPath.setAttributeNS(null, 'points', this.svg_atts.strokes.divider.points[mapType])
                strokeLayer.appendChild(divPath)
            }
            if ( strokeLayer.hasChildNodes ) {
                if ( svgElm.prepend ) {
                    svgElm.prepend(strokeLayer)
                } else {
                    svgElm.insertBefore(strokeLayer, svgElm.childNodes[0])
                }
            }
            svgElm.style.position = 'relative'
            svgElm.addEventListener('mousemove', (evt) => {
                this.curX = evt.x//evt.offsetX
                this.curY = evt.y//evt.offsetY
            }, false)

            if ( this.opts.height ) {
                this.map_container.style.height = this.opts.height
            }
            if ( this.opts.width ) {
                this.map_container.style.width = this.opts.width
            }
            if ( ! this.opts.height && ! this.opts.width ) {
                this.map_container.style.height = '90vh'
            }
            this.map_container.appendChild(svgElm)
            resolve(svgElm)
        })
    }

    showTips() {
        if ( ! this.opts.withTips ) {
            return
        }
        let _activePath = this.map_container.querySelector('path.active'),
            activePref = null,//_activePath ? _activePath.dataset : null,
            contents = []
        if ( _activePath && ! activePref && _activePath.getAttribute('data-name') ) {
            // For all within ie11
            activePref = {
                region: parseInt( _activePath.getAttribute('data-region'), 10 ),
                name: _activePath.getAttribute('data-name'),
                default: _activePath.getAttribute('data-default'),
            }
        }
        if ( activePref ) {
            const tips = document.createElement('div')
            tips.id = 'svg-japan-tips'
            if ( tips.classList ) {
                tips.classList.add('svg-map-tips')
            } else {
                tips.setAttribute('class', 'svg-map-tips')
            }
            if ( this.opts.regionality ) {
                let regionList = this.opts.regions || this.regions,
                    _match = regionList.find( ({ id }) => id == activePref.region ),
                    regionName = _match ? _match.name : null
                if ( regionName ) {
                    contents.push( `<span class="region-name">${regionName}</span>` )
                }
            }
            if ( hasProp( 'name', activePref ) ) {
                contents.push( `<span class="prefecture-name">${activePref.name}</span>` )
            }
            tips.innerHTML = contents.join( "\n" )
            tips.style.position = 'absolute'
            this.map_container.appendChild(tips)
            let _cs = window.getComputedStyle( this.map_container ),
                _posX = this.curX - this.map_container.offsetLeft + (parseInt(_cs.getPropertyValue('font-size'), 10) * 2),
                _posY = this.curY - this.map_container.offsetTop - (parseInt(_cs.getPropertyValue('font-size'), 10) * 2)
//console.log( [ this.map_container ], _posX, _posY )
            tips.style.left = `${_posX}px`
            tips.style.top  = `${_posY}px`
            tips.style.visibility = 'visible'
        } else {
            const targetTips = document.getElementById('svg-japan-tips')
            targetTips.style.visibility = 'hidden'
            targetTips.parentNode.removeChild(targetTips)
        }
    }

    selectedMap( element ) {
        //logger( [ 'selectedMap:', element ], 'log' )
        element.dispatchEvent( this.svgJapanEvent )
    }

}

export default svgJapan