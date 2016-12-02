import { Meteor } from 'meteor/meteor'

import { Polls, newPoll } from './collections'
import { joinClientMethod } from './api'

// The server publishes a single game right now, without reference to any Database
if (Meteor.isServer) {
    Meteor.publish('poll', function(pollId) {
        const client = this
        const { id, clientAddress } = client.connection
        const clientArgs = {
            connectionId: id,
            clientAddress
        }

        // The publish function is run for each subscriber
        joinClientMethod.call(clientArgs)
        client.onStop(() => {
            joinClientMethod.call({ ...clientArgs, disconnected: true})
        })

        return Polls.find(pollId)
    })

    Meteor.startup(() => {
        if (Polls.find().count() === 0) {
            let seed = { ...newPoll(), _id: 'polls:demo' }
            Polls.insert(seed)
        }
    })

    Polls.find('polls:demo').observeChanges({
        removed: () => {
            Polls.insert({ ...newPoll(), _id: 'polls:demo' })
        }
    })
}

// The client notifies the server of its interest in 'games'
if (Meteor.isClient) {
    // a handle with:
    // .stop() - unsubscribe; rolls back changes to corresponding collections
    // .ready() (has it seen the ready event?)
    let subsHandle = Meteor.subscribe('poll', 'polls:demo')
    Object.assign(window, {
        pollSubscription: subsHandle
    })
}


// * Note: done in a single-file for demo-purposes
