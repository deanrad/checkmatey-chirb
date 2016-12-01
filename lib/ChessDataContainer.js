import { Bert } from 'meteor/themeteorchef:bert'
import { connect } from 'react-redux'
import ChessGame from './ChessGame'
import { makeMove } from './api'
import './pubsub'

const selectState = state => state
// AKA mapDispatchToProps - dont need dispatch if you call a Meteor method
const createHandlers = () => ({
    dropHandler: (from, to, mover) => {
        makeMove({ from, to, mover})
            .catch(err => {
                Bert.alert({ title: 'Error', message: err.error, type: 'danger', style: 'fixed-top' })
            })
    }
})

const container = connect(selectState, createHandlers)(ChessGame)
export default container
