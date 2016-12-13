import { Map } from 'immutable'
import { createReducer } from 'redux-act'
import { inAgencyRun } from './antares'

/** Actions are named change requests containing all data
  * needed to implement a change
*/
export const Actions = {
    Game: {
        create: (game) => ({
            type: 'Game.create',
            payload: game,
            meta: {
                antares: {
                    createAtKey: game._id
                }
            }
        }),
        merge: (topLevelFields) => ({
            type: 'Game.merge',
            payload: topLevelFields,
            meta: {
                antares: {
                    key: 'games:initial' //XXX current antares selector should be used
                }
            }
        }),
        mergeDeep: (subtree) => ({
            type: 'Game.mergeDeep',
            payload: subtree,
            meta: {
                antares: {
                    key: 'games:initial'
                }
            }
        })
    }
}

export const News = {
    originate: (actionCreator, ...args) => actionCreator(...args),

    // returns a thenable, eventually extended with {
    //    epic: Observable,
    //    optimisticResult: immediate
    // }
    dispatch: (actionCreator, ...args) => {
        let action = News.originate(actionCreator, ...args)

        // TODO return the promise
        return Promise.resolve(store.dispatch(action))
    },
}

export const gameReducer = createReducer({
    'Game.merge': (game, topLevelFields) => {
        return game.merge(topLevelFields)
    },
    'Game.mergeDeep': (game, subtree) => {
        return game.mergeDeep(subtree)
    }
}, new Map())
