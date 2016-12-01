import { createReducer } from 'redux-act'
import { applyMiddleware, compose, createStore } from 'redux'

import { Polls } from './collections'

// There is a store for each docId
const allStores = new Map()

/** Actions are named change requests containing all data
  * needed to implement a change
*/
const Actions = {
    Poll: {
        merge: (fields) => ({
            type: 'Poll.merge',
            payload: fields
        })
    }
}

/** Reducers are the ones that, per each action, take in an existing object
  * and apply the action to it, creating a new object
*/
const Reducers = {
    Poll: createReducer({
        'Poll.merge': (poll, fields) => ({ ...poll, ...fields })
    }, {})
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
    let action = Actions.Poll.merge(fields)
    store.dispatch(action)
}

export const getStore = (docId) => {
    let storeId = Symbol.for(`${docId}`)
    let cached = allStores.get(storeId)
    if (cached) return cached

    let store = makeStoreFromReducer(Reducers.Poll)
    allStores.set(storeId, store)

    // Propogate Meteor changes to the store - our UI depends only upon the store
    Polls.find(docId).observeChanges({
        added: mergeChangesToStore,
        changed: mergeChangesToStore
    })

    return allStores.get(storeId)
}

export const store = getStore('polls:demo')
if (Meteor.isClient) { window.store = store}
