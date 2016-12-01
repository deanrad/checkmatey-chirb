import { connect, Provider } from 'react-redux'
import PollAdmin from './PollAdmin'
import { getStore } from '../store'

const store = getStore('polls:demo')

// admin can see the entire state tree
const selectState = (state) => state

const createHandlers = () => ({
    advanceQuestion: () => {
        console.log(`TODO advance question`)
    }
})

export const PollAdminPropsProvider = connect(selectState, createHandlers)(PollAdmin)
