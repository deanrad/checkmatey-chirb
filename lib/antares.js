import { antares } from 'antares'
import { Iterable, Map as iMap } from 'immutable'
console.log( antares() )

export const inAgencyRun = (agencyType, fn) => {
    if (agencyType==='any') fn.call(this)
    if (agencyType==='user' && Meteor.isClient) fn.call(this)
    if (agencyType==='root' && Meteor.isServer) fn.call(this)
}

// XXX Meteor wrap
const agentBoot = new Promise(resolve => {
    Meteor.startup(() => resolve())
})

export const agentRunAtBoot = (type, fn) => {
    agentBoot.then(() => {
        inAgencyRun(type, fn)
    })
}

inAgencyRun('any', function() {
    Object.assign(this, {
        Iterable,
        inAgencyRun
    })
})

//////////////////////////// Reducers /////////////////////////
export const antaresReducer = (state, action) => {
    if (!state) return new iMap()

    let { type, payload, meta } = action
    console.log('AA>', { type })

    let { antares } = (meta || {})
    let { createAtKey } = antares

    // meta.antares.createAtKey - fail if record cant be stored using this key
    if (createAtKey) {
        return state.set(createAtKey, payload)
    }
    return state
}

export const toJS = (obj) => {
    if (Iterable.isIterable(obj)) {
        return obj.toJS()
    }
    return obj
}

//////////////////////////////////////////////////////////
