import { News, agentRunAtBoot } from './antares'
import { Actions, newGame } from './api'

agentRunAtBoot('user', () => {
    News.dispatch(Actions.Game.create, newGame())
        .then(action => {
            console.log('Yay, dispatch successful!', action)
        })
})
