import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

import Promise from 'bluebird'
import { diff as getMongoUpdate } from 'mongodb-diff'

import { store, pollReducer } from './store'
import { Polls } from './collections'


const respondPollMethod = new ValidatedMethod({
    name: 'Poll.respond',
    validate: () => { /* TODO */ },
    run({ id, choice }) {
        // console.log('running')

        let client = this

        // allow for demoing of latency and errors
        if (Meteor.isServer) {
            if (Math.floor(Math.random() * 10) > 7) {
                Meteor.sleep(2500)
            }
        }

        // perform the Mongo update
        Polls.update('polls:demo', {
            $push: {
                'active.responses': {
                    id,
                    choice,
                    connection: (client.connection && client.connection.id)
                }
            }
        })
    }
})

const advanceQuestionMethod = new ValidatedMethod({
    name: 'Poll.Admin.advanceQuestion',
    validate: () => { /* TODO */ },
    run() {
        const poll = store.getState()
        let existingResponses = (poll.active.responses || [])
        let nextId = (poll.active.id === null ? -1 : poll.active.id) + 1
        let nextQuestion = poll.questions.find(q => q.id >= nextId) ||
                            poll.questions.find(q => q.id === 0)

        Polls.update('polls:demo', {
            $set: {
                active: nextQuestion
            },
            $push: {
                responses: { $each: existingResponses }
            }
        })
    }
})

export const joinClientMethod = new ValidatedMethod({
    name: 'Poll.joinClient',
    validate: () => {},
    run({ connectionId, clientAddress, disconnected }) {

        const joined = {
            $push: {
                clients: { connectionId, clientAddress }
            }
        }

        const left = {
            $pull: {
                clients: { connectionId }
            }
        }

        const mongoUpdate = disconnected ? left : joined
        Polls.update('polls:demo', mongoUpdate)
    }
})

const promisify = (validatedMethod) => {
    return Promise.promisify(validatedMethod.call, { context: validatedMethod })
}

export const respondPoll = promisify(respondPollMethod)
export const advanceQuestion = promisify(advanceQuestionMethod)
