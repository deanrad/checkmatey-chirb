import { connect, Provider } from 'react-redux'
import Poll from './Poll'
import { getStore } from '../store'

export const store = getStore('polls:demo')
if (Meteor.isClient) { window.store = store}

const selectState = (state) => (state.active || {})
const createHandlers = () => ({
    respondPoll: ({ id, choice }) => {
        console.log(`TODO respond ${choice} to ${id}`)
    }
})

export const PollPropsProvider = connect(selectState, createHandlers)(Poll)
