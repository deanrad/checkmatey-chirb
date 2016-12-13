import { Random } from 'meteor/random'
import { Map } from 'immutable'
import { createReducer } from 'redux-act'
import { AntaresError } from 'antares'

/** Actions are named change requests containing all data
  * needed to implement a change
*/
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
        })
    }
}

const gameReducer = createReducer({
    'Game.merge': (game, topLevelFields) => {
        return game.merge(topLevelFields)
    },
    'Game.mergeDeep': (game, subtree) => {
        return game.mergeDeep(subtree)
    },
    'Game.initiateMove': (game, { from, to, mover }) => {
        let pieceAtFrom = game.getIn(['position', from])
        if (!pieceAtFrom || (mover !== pieceAtFrom)) {
            throw new AntaresError({type: 'Game.initiateMove.moverMismatch'})
        }

        return game
            .deleteIn(['position', from])
            .setIn(['position', to], mover)
    }
}, new Map())

export const reducerFromKey = (...keyParts) => {
    // TODO actually determine reducer from key
    return gameReducer
}

export const agentOnceBooted = new Promise(resolve => {
    Meteor.startup(() => resolve())
})

export const newId = () => {
    return Random.id()
}
