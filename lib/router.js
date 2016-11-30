import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { getStore } from '/lib/store'
import ChessDataContainer from './ChessDataContainer'

const store = getStore('games:demo')

if (Meteor.isClient) {
    Meteor.startup(() => {
        window.store = store
        render(
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route>
                        <Route path="/" component={ ChessDataContainer } />
                    </Route>
                </Router>
            </Provider>,
            document.getElementById('react-root')
        )
    })
}
