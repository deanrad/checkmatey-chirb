import { Mongo } from 'meteor/mongo'
// Both environments-client (browser/native) and server- get this collection
// On the client:
//     Websocket messages change the contents of this collection over time
// On the server:
//     Method calls change its contents, these changes will be published to
//     those clients who have subscribed
export const Games = new Mongo.Collection('Games')

// A factory function for seeding
export const newGame = () => ({
    _id: 'games:initial',
    position: {
        e8: 'bK'
    }
})

