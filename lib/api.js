import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Map } from 'immutable'
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
export const newGame = () => ({
    _id: 'games:initial',
    position: {
        e8: 'bK'
    },
    whiteToMove: true
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
const Epics = {
}

// Selectors


