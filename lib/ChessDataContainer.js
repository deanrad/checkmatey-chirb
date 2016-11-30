import { connect } from 'react-redux'

import ChessGame from './ChessGame'
import { makeMove } from './api'
import './pubsub'

const selectState = state => state
// AKA mapDispatchToProps - dont need dispatch if you call a Meteor method
const createHandlers = () => ({
    dropHandler: (from, to) => {
        // console.log(`TODO move from ${from} to ${to}`)
        makeMove.call({ from, to })
    }
})

const container = connect(selectState, createHandlers)(ChessGame)
export default container
