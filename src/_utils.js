/**
 * Determine whether variable is an Object
 * @param {!(number|string|Object|boolean)} item - Variable you want to check
 * @return {boolean}
 */
function isObject( o ) {
    return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object
}

/**
 * Determine whether variable is an Element
 * @param {!(number|string|Object|boolean)} node - Variable you want to check
 * @return {boolean}
 */
function isElement( node ) {
    try {
        return node instanceof HTMLElement
    } catch( e ) {
        if ( ( typeof node === 'object' ) && ( node.nodeType === 1 ) && ( typeof node.style === 'object' ) && ( typeof node.ownerDocument === 'object' ) ) {
            return true
        } else {
            return !!( node && ( node.nodeName || ( node.prop && node.attr && node.find ) ) )
        }
    }
}

/**
 * Merge multiple objects given as arguments, maintaining a deep hierarchy
 * @param {!Object} args[0] - Object to merge from
 * @param {!Object} args[n] - Any objects to merge
 * @return {Object}
 */
function extend( ...args ) {
    const to = Object( args[0] )
    for ( let i = 1; i < args.length; i += 1 ) {
        const nextSource = args[i]
        if ( nextSource !== undefined && nextSource !== null ) {
            const keysArray = Object.keys( Object( nextSource ) )
            for ( let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1 ) {
                const nextKey = keysArray[nextIndex]
                const desc = Object.getOwnPropertyDescriptor( nextSource, nextKey )
                if ( desc !== undefined && desc.enumerable ) {
                    if ( isObject( to[nextKey] ) && isObject( nextSource[nextKey] ) ) {
                        extend( to[nextKey], nextSource[nextKey] )
                    } else if ( ! isObject( to[nextKey] ) && isObject( nextSource[nextKey] ) ) {
                        to[nextKey] = {}
                        extend( to[nextKey], nextSource[nextKey] )
                    } else {
                        to[nextKey] = nextSource[nextKey]
                    }
                }
            }
        }
    }
    return to
}

/**
 * Check property in an object as same `Object.prototype.hasOwnProperty.call()`
 * @param {!string} prop - Check property name
 * @param {!Object} obj - Target object
 * @return {boolean}
 */
function hasProp( prop, obj ) {
    return !!(obj) && Object.prototype.hasOwnProperty.call( obj, prop )
}

/**
 * Custom exception logging
 *
 * @param {!string} message - Message body to notify
 * @param {string} [type="error"] - Notification type
 * @return {void}
 */
function logger( message, type = 'error' ) {
    if ( 'error' === type ) {
        throw new Error( message )
    } else {
        console[type]( message )
    }
}

export { isObject, isElement, extend, hasProp, logger }