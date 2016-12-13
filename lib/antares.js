import { antares, AntaresError } from 'antares'
import { Iterable, fromJS, Map as iMap } from 'immutable'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import { Agents, AgentEvents, Actions, ReducerFromKey, Epics, newId } from './api'

console.log( antares() )

export const isInAgency = (agencyType) => {
    let runOnThisAgent = Agents[agencyType] || (() => false)
    return runOnThisAgent()
}

export const inAgencyRun = (agencyType, fn) => {
    isInAgency(agencyType) && fn.call(this)
}

export const agentRunAtBoot = (type, fn) => {
    AgentEvents.boot.then(() => {
        inAgencyRun(type, fn)
    })
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
            key: 'games:initial' // TODO get from context
        }
    }
}
const antaresActionIdEnhancer = () => {
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
    let { createAtKey, key } = (antares || {})

    // meta.antares.createAtKey - fail if record cant be stored using this key
    if (createAtKey) {
        if (state.has(createAtKey)) throw new AntaresError({type: 'createAtKey'})
        return state.set(createAtKey, fromJS(payload))
    }

    // meta.antares.key - updates should be targeted to this key
    if (key) {
        if (! state.has(key)) throw new AntaresError({type: 'updateKey'})

        let reducer = ReducerFromKey(key)
        return state.update(key, state => reducer(state, action))
    }

    return state
}

const rootReducer = combineReducers({
    antares: antaresReducer
})

const rootEpic = combineEpics(...Object.values(Epics))
const epicMiddleware = createEpicMiddleware(rootEpic)

// A utility function which incorporates Redux DevTools and optional middleware
const makeStoreFromReducer = (reducer, ...middleware) => {
    let composeEnhancers = compose

    // in browsers override
    inAgencyRun('user', function() {
        composeEnhancers = this.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    })

    return createStore(reducer, composeEnhancers(
        applyMiddleware(...middleware)
    ))
}

export const store = makeStoreFromReducer(rootReducer, epicMiddleware)

//////////////////////////////////////////////////////////

export const toJS = (obj) => {
    if (Iterable.isIterable(obj)) {
        return obj.toJS()
    }
    return obj
}

inAgencyRun('any', function() {
    Object.assign(this, {
        News,
        Actions,
        store,
        toJS
    })
})
