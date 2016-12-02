import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { store } from './store'
import { Polls } from './collections'

import Promise from 'bluebird'

const respondPollMethod = new ValidatedMethod({
    name: 'Poll.respond',
    validate: () => { /* TODO */ },
    run({ id, choice }) {
        // console.log('running')

        let client = this

        // allow for demoing of latency and errors
        if (Meteor.isServer) {
            if (Math.floor(Math.random()*10) > 7) {
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
        console.log('TODO Poll.Admin.advanceQuestion')
        // const before = store.getState()
        // const after = fromJS(before)
        //     .update('active', () => )
        //     .toJS()
        // const diff =
    }
})

const promisify = (validatedMethod) => {
    return Promise.promisify(validatedMethod.call, { context: validatedMethod })
}

export const respondPoll = promisify(respondPollMethod)
export const advanceQuestion = promisify(advanceQuestionMethod)
