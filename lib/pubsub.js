import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { getStore } from './store'

// Both environments-client (browser/native) and server- get this collection
// On the client:
//     Websocket messages change the contents of this collection over time
// On the server:
//     Method calls change its contents, these changes will be published to
//     those clients who have subscribed
export const Games = new Mongo.Collection('Games')

// A factory function for seeding
export const newGame = () => ({
    board: {
        position: {
            a8: 'bR', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bR',
            a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
            a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
            a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wR'
        }
    }
})

// The server publishes a single game right now, without reference to any Database
if (Meteor.isServer) {
    Meteor.publish('games', () => {
        return Games.find()
    })

    Meteor.startup(() => {
        if (Games.find().count() === 0) {
            let seedGame = { ...newGame(), _id: 'games:demo' }
            Games.insert(seedGame)
        }
    })
}

// The client notifies the server of its interest in 'games'
if (Meteor.isClient) {
    // a handle with:
    // .stop() - unsubscribe; rolls back changes to corresponding collections
    // .ready() (has it seen the ready event?)
    let subsHandle = Meteor.subscribe('games')
    Object.assign(window, {
        Games,
        gameSubscription: subsHandle
    })
}

export const makeMove = new ValidatedMethod({
    name: 'Games.makeMove',
    validate: () => { /* TODO */ },
    run({ from, to }) {
        let game = getStore('games:demo').getState()

        // pick-up mover
        let mover = game.board.position[from]

        // allow for demoing of latency and errors
        if (Meteor.isServer) {
            Meteor.sleep(3000)
            if (to === 'f6') {
                // Use Meteor.Error for application-defined errors
                throw new Meteor.Error('Moving to f6 raises an error, demoing UI rollback')
            }
        }

        // perform the Mongo update
        Games.update('games:demo', {
            $unset: {
                [`board.position.${from}`]: 1
            },
            $set: {
                [`board.position.${to}`]: mover
            }
        })
    }
})

// * Note: done in a single-file for demo-purposes
