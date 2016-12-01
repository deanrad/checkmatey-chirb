import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { getStore } from '/lib/store'
import Poll from './components/Poll'

const store = getStore('polls:demo')

if (Meteor.isClient) {
    Meteor.startup(() => {
        window.store = store
        render(
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route>
                        <Route path="/" component={ Poll } />
                    </Route>
                </Router>
            </Provider>,
            document.getElementById('react-root')
        )
    })
}
