import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { store } from './store'

import { News, agentRunAtBoot } from './antares'

import ExampleChessBoard from '../react-dnd-chessboard/Board'
import './seedNews'

agentRunAtBoot('user', () => {
    render(
        <ExampleChessBoard knightPosition={[ 4, 4]}/>
        ,
        document.getElementById('react-root')
    )
})
