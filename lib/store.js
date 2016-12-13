import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { inAgencyRun, antaresReducer, toJS } from './antares'

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

export const store = makeStoreFromReducer(rootReducer)

inAgencyRun('any', function () {
    Object.assign(this, {
        store,
        toJS
    })
})
