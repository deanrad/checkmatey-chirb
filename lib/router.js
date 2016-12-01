import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import ChessDataContainer from './ChessDataContainer'

if (Meteor.isClient) {
    Meteor.startup(() => {
        render(
            ChessDataContainer
            ,
            document.getElementById('react-root')
        )
    })
}
