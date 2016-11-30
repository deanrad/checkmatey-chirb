import { Meteor } from 'meteor/meteor'

import { Games, newGame } from './collections'

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


// * Note: done in a single-file for demo-purposes
