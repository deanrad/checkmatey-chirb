import { createReducer } from 'redux-act'
import { applyMiddleware, compose, createStore } from 'redux'

import { Games } from './collections'

// There is a store for each docId
const allStores = new Map()

/** Actions are named change requests containing all data
  * needed to implement a change
*/
const Actions = {
    Game: {
        merge: (fields) => ({
            type: 'Game.merge',
            payload: fields
        })
    }
}

/** Reducers are the ones that, per each action, take in an existing object
  * and apply the action to it, creating a new object
*/
const Reducers = {
    Game: createReducer({
        'Game.merge': (game, fields) => ({ ...game, ...fields })
    }, { board: { position: {} } })
}

// A utility function which incorporates Redux DevTools and optional middleware
const makeStoreFromReducer = (reducer, ...middleware) => {
    const composeEnhancers = ((typeof window !== 'undefined')
        && (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) || compose

    return createStore(reducer, composeEnhancers(
        applyMiddleware(...middleware)
    ))
}

// A function which, receiving (docId, fields), dispatches
// XXX not generic enough for dispatch
const mergeChangesToStore = (docId, fields) => {
    let store = getStore(docId)
    let action = Actions.Game.merge(fields)
    store.dispatch(action)
}

export const getStore = (docId) => {
    let storeId = Symbol.for(`${docId}`)
    let cached = allStores.get(storeId)
    if (cached) return cached

    let store = makeStoreFromReducer(Reducers.Game)
    allStores.set(storeId, store)

    // Propogate Meteor changes to the store - our UI depends only upon the store
    Games.find(docId).observeChanges({
        added: mergeChangesToStore,
        changed: mergeChangesToStore
    })

    return allStores.get(storeId)
}
