import { createReducer } from 'redux-act'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import { Actions } from './api'
import { inAgencyRun, antaresReducer, toJS } from './antares'

// There is a store for each docId
const allStores = new Map()

/** Reducers are the ones that, per each action, take in an existing object
  * and apply the action to it, creating a new object

*/

const rootReducer = combineReducers({
    antares: antaresReducer
})

// A utility function which incorporates Redux DevTools and optional middleware
const makeStoreFromReducer = (reducer, ...middleware) => {
    const composeEnhancers = ((typeof window !== 'undefined')
        && (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) || compose

    return createStore(reducer, composeEnhancers(
        applyMiddleware(...middleware)
    ))
}

export const getStore = (docId) => {
    let storeId = Symbol.for(`${docId}`)
    let cached = allStores.get(storeId)
    if (cached) return cached

    let store = makeStoreFromReducer(rootReducer)
    allStores.set(storeId, store)

    return allStores.get(storeId)
}

export const store = getStore('antares:root')

inAgencyRun('any', function () {
    Object.assign(this, {
        store,
        toJS
    })
})
