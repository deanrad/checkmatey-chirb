import { connect, Provider } from 'react-redux'
import PollLive from './PollLive'
import { store } from '../store'

// admin can see the entire state tree
const selectState = (state) => state

const createHandlers = () => ({
})

export const PollLivePropsProvider = connect(selectState, createHandlers)(PollLive)
