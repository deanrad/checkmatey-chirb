import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import ChessPropsProvider from './ChessPropsProvider'

if (Meteor.isClient) {
    import ExampleChessBoard from '../client/react-dnd-chessboard/Board'
    Meteor.startup(() => {
        render(
            <ExampleChessBoard knightPosition={[ 4, 4]}/>
            ,
            document.getElementById('react-root')
        )
    })
}
