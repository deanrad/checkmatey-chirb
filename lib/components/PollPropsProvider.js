import { connect, Provider } from 'react-redux'
import Poll from './Poll'
import { store } from '../store'
import { respondPoll } from '../api'

const selectState = (state) => (state.active || {})
const handlers = () => ({
    respondPoll
})

export const PollPropsProvider = connect(selectState, handlers)(Poll)
