import { antares } from 'antares'
import { Iterable, fromJS, Map as iMap } from 'immutable'
import { gameReducer, News, Actions } from './api'

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
        inAgencyRun,
        News,
        Actions
    })
})

class AntaresError extends Error {
    constructor({type}) { super(type) }
}

const reducerFromKey = (...keyParts) => {
    // TODO actually determine reducer from key
    return gameReducer
}

//////////////////////////// Reducers /////////////////////////
export const antaresReducer = (state, action) => {
    if (!state) return new iMap()

    let { type, payload, meta } = action
    console.log('AR>', { type })

    let { antares } = (meta || {})
    let { createAtKey, key } = antares

    // meta.antares.createAtKey - fail if record cant be stored using this key
    if (createAtKey) {
        if (state.has(createAtKey)) throw new AntaresError({type: 'createAtKey'})
        return state.set(createAtKey, fromJS(payload))
    }

    // meta.antares.key - updates should be targeted to this key
    if (key) {
        if (! state.has(key)) throw new AntaresError({type: 'updateKey'})

        let reducer = reducerFromKey(key)
        return state.update(key, state => reducer(state, action))
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
