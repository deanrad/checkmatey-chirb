import { antares } from 'antares'
import { Iterable, fromJS, Map as iMap } from 'immutable'
import { agentOnceBooted, reducerFromKey, Actions, newId } from './api'

console.log( antares() )

export const inAgencyRun = (agencyType, fn) => {
    if (agencyType==='any') fn.call(this)
    if (agencyType==='user' && Meteor.isClient) fn.call(this)
    if (agencyType==='root' && Meteor.isServer) fn.call(this)
}

export const agentRunAtBoot = (type, fn) => {
    agentOnceBooted.then(() => {
        inAgencyRun(type, fn)
    })
}

export class AntaresError extends Error {
    constructor({type}) { super(type) }
}

/////////////// News / Dispatch //////////////////////////////
const antaresKeysMetaEnhancer = (action) => {
    let type = action.get('type')

    if (type.match(/create$/)) {
        return {
            createAtKey: action.getIn(['payload', '_id'])
        }
    } else {
        return {
            key: 'games:initial'
        }
    }
}
const antaresActionIdEnhancer = (action) => {
    return {
        actionId: newId()
    }
}

export const News = {
    originate: (actionCreator, whassup) => fromJS(actionCreator(whassup)),

    // returns a thenable, eventually extended with {
    //    epic: Observable,
    //    optimisticResult: immediate
    // }
    dispatch: (actionCreator, whassup) => {
        let action = News.originate(actionCreator, whassup)
        let metaEnhancers = [
            antaresKeysMetaEnhancer,
            antaresActionIdEnhancer
        ]

        let actionWithMeta = metaEnhancers.reduce((action, enhancer) => {
            return action.mergeIn(['meta', 'antares'], enhancer(action))
        }, action)

        // TODO return the promise
        return Promise.resolve(store.dispatch(actionWithMeta.toJS()))
    },
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

inAgencyRun('any', function() {
    Object.assign(this, {
        Iterable,
        inAgencyRun,
        News,
        Actions
    })
})
