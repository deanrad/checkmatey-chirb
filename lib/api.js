import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { fromJS, Map } from 'immutable'
import { createReducer } from 'redux-act'
import { AntaresError } from 'antares'

//////// isolate platform specific bits ////////////
export const newId = () => {
    return Random.id()
}

////////// define our actual API ////////////

// Agents
export const Agents = {
    any: () => true,
    user: () => Meteor.isClient,
    root: () => Meteor.isServer
}
export const AgentEvents = {
    boot: new Promise(resolve => Meteor.startup(resolve))
}

// News (Data)

const Games = {
    ONE_KING: {
        position: {
            d4: 'bK'
        }
    },
    TWO_ASKEW: {
        position: {
            c5: 'bQ',
            e4: 'wQ'
        },
        whiteToMove: true
    },
    FACE_OFF: {
        position: {
            d5: 'bQ',
            d3: 'wK'
        },
        whiteToMove: true
    },
}

let gameId = 1
export const createGame = (factory='ONE_KING') => ({
    _id: `games:demo:${gameId++}`,
    ...(Games[factory] || {})
})

// Types (Schema)
export const Types = {
    Game: {}
}

// Actions
export const Actions = {
    Game: {
        create: (game) => ({
            type: 'Game.create',
            payload: game
        }),
        merge: (topLevelFields) => ({
            type: 'Game.merge',
            payload: topLevelFields
        }),
        mergeDeep: (subtree) => ({
            type: 'Game.mergeDeep',
            payload: subtree
        }),
        initiateMove: ({ from, to, mover }) => ({
            type: 'Game.initiateMove',
            payload: { from, to, mover }
        }),
        concludeTurn: () => ({
            type: 'Game.concludeTurn',
            payload: {}
        })
    }
}

// Reducers
const Reducers = {
    Game: createReducer({
        'Game.merge': (game, topLevelFields) => {
            return game.merge(topLevelFields)
        },
        'Game.mergeDeep': (game, subtree) => {
            return game.mergeDeep(subtree)
        },
        'Game.initiateMove': (game, { from, to, mover }) => {
            let pieceAtFrom = game.getIn(['position', from])
            if (!pieceAtFrom || (mover !== pieceAtFrom)) {
                throw new AntaresError({ type: 'Game.initiateMove.moverMismatch' })
            }

            return game
                .deleteIn(['position', from])
                .setIn(['position', to], mover)
        },
        'Game.concludeTurn': (game) => {
            return game
                .update('whiteToMove', orig => (!orig))
        }
    }, new Map())
}

export const ReducerFromKey = () => {
    // TODO actually determine reducer from key
    return Reducers.Game
}

// Epics
export const Epics = {
    'Game.takeTurns': (action$) => {
        return action$
            .ofType('Game.initiateMove')
            .map(action => ({
                type: 'Game.concludeTurn',
                payload: null,
                // TODO the epics should be wrapped by antares to do this id-linking
                meta: {
                    antares: {
                        ...action.meta.antares,
                        actionId: newId(),
                        completesEpic: action.meta.antares.actionId,
                    }
                }
            }))
    }
}

// Selectors


