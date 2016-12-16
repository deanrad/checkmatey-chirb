import { News, agentRunAtBoot } from './antares'
import { Actions, createGame } from './api'

agentRunAtBoot('user', () => {
    Promise.all([
        News.dispatch(Actions.Game.create, createGame()),
        News.dispatch(Actions.Game.create, createGame('FACE_OFF'))
    ])
    .then(action => {
        console.log('Yay, seeding successful!', action)
    })
})
