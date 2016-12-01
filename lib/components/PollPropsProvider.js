import { connect, Provider } from 'react-redux'
import Poll from './Poll'
import { store } from '../store'

const selectState = (state) => (state.active || {})
const createHandlers = () => ({
    respondPoll: ({ id, choice }) => {
        console.log(`TODO respond ${choice} to ${id}`)
    }
})

export const PollPropsProvider = connect(selectState, createHandlers)(Poll)
