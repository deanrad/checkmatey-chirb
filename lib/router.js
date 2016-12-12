import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import ChessPropsProvider from './ChessPropsProvider'

if (Meteor.isClient) {
    Meteor.startup(() => {
        render(
            ChessPropsProvider
            ,
            document.getElementById('react-root')
        )
    })
}
