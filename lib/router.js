import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { newGame } from './collections'
import { Actions } from './api'
import { agentRunAtBoot } from './antares'

import ExampleChessBoard from '../react-dnd-chessboard/Board'

const News = {
    originate: (actionCreator, ...args) => actionCreator(...args)
}

agentRunAtBoot('user', () => {

    // could be News.dispatch with same API
    let action = News.originate(Actions.Game.create, newGame())
    store.dispatch(action)

    render(
        <ExampleChessBoard knightPosition={[ 4, 4]}/>
        ,
        document.getElementById('react-root')
    )
})
