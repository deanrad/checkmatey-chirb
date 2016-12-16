import { News, agentRunAtBoot } from './antares'
import { Actions, newGame } from './api'

agentRunAtBoot('user', () => {
    Promise.all([
        News.dispatch(Actions.Game.create, newGame()),
        News.dispatch(Actions.Game.create, { ...newGame(), _id: 'games:demo1' })
    ])
    .then(action => {
        console.log('Yay, seeding successful!', action)
    })
})
