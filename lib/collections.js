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
        prompt: 'Which server-push implementation have you used ?',
        choices: [
            'Socket.io',
            'MeteorJS',
            'SSE',
            'Long Polling'
        ]
    },
    questions: [
        {
            id: 0,
            prompt: 'What is your favorite non-Santa Christmas character?',
            choices: [
                'Rudolph',
                'Mrs. Claus',
                'The Gingerbread Man',
                'The Krampus'
            ]
        },
        {
            id: 1,
            prompt: 'Which server-push implementation have you used ?',
            style: 'multiple',
            choices: [
                'Socket.io',
                'MeteorJS',
                'SSE',
                'Long Polling'
            ]
        },
        {
            id: 2,
            prompt: 'Mountain Dew was originally slang for:',
            imgSrc: 'https://s3.amazonaws.com/www.deanius.com/images/mountain-dew.jpg',
            choices: [
                'Coffee',
                'Red Bull',
                'Whiskey',
                'Moonshine'
            ]
        },
        {
            id: 3,
            prompt: "JavaScript's creator Brendan Eich spent this long building it:",
            choices: [
                '10 hours',
                '10 days',
                '10 weeks',
                '10 months'
            ]
        },

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
