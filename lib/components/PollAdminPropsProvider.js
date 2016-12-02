import { connect, Provider } from 'react-redux'
import PollAdmin from './PollAdmin'
import { store } from '../store'
import { advanceQuestion } from '../api'

// admin can see the entire state tree
const selectState = (state) => state

const createHandlers = () => ({
    advanceQuestion
})

export const PollAdminPropsProvider = connect(selectState, createHandlers)(PollAdmin)
