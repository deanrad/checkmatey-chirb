import { Mongo } from 'meteor/mongo'
// Both environments-client (browser/native) and server- get this collection
// On the client:
//     Websocket messages change the contents of this collection over time
// On the server:
//     Method calls change its contents, these changes will be published to
//     those clients who have subscribed
export const Polls = new Mongo.Collection('Polls')

// A factory function for seeding
export const newPoll = () => ({
    active: {
        id: 0,
        prompt: 'Foo?',
        choices: [
            'A bit',
            'Bar',
            'Certainly',
            'Dont reckon I do'
        ]
    },
    questions: [
        {
            id: 0,
            prompt: 'Foo?',
            choices: [
                'A bit',
                'Bar',
                'Certainly',
                'Dont reckon I do'
            ]
        },
        {
            id: 2,
            prompt: 'Which server-push implementation have you used ?',
            style: 'multiple',
            choices: [
                'Socket.io',
                'MeteorJS',
                'SSE',
                'Long Polling'
            ]
        }
    ],
    responses: [
    ]
})

if (Meteor.isClient) {
    window.Polls = Polls
    window.newPoll = newPoll
} else {
    global.Polls = Polls
    global.newPoll = newPoll
}
