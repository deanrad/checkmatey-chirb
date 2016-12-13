import { News, agentRunAtBoot } from './antares'
import { Actions } from './api'

// A factory function for seeding
export const newGame = () => ({
    _id: 'games:initial',
    position: {
        e8: 'bK'
    }
})

agentRunAtBoot('user', () => {
    News.dispatch(Actions.Game.create, newGame())
        .then(action => {
            console.log('Yay, dispatch successful!', action)
        })
})
