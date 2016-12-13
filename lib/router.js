import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { newGame } from './collections'
import { store } from './store'
import { News, Actions } from './api'
import { agentRunAtBoot } from './antares'

import ExampleChessBoard from '../react-dnd-chessboard/Board'


agentRunAtBoot('user', () => {

    News.dispatch(Actions.Game.create, newGame())
        .then(action => {
            console.log('Yay, dispatch successful!', action)
        })

    render(
        <ExampleChessBoard knightPosition={[ 4, 4]}/>
        ,
        document.getElementById('react-root')
    )
})
