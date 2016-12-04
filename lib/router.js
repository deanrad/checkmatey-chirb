import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, browserHistory } from 'react-router'

import { store } from '/lib/store'

import { PollPropsProvider } from './components/PollPropsProvider'
import { PollAdminPropsProvider } from './components/PollAdminPropsProvider'
import { PollLivePropsProvider } from './components/PollLivePropsProvider'

if (Meteor.isClient) {
    Meteor.startup(() => {
        window.store = store
        render(
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={ PollPropsProvider } />
                    <Route path="admin" component={ PollAdminPropsProvider } />
                    <Route path="live" component={ PollLivePropsProvider } />
                </Router>
            </Provider>,
            document.getElementById('react-root')
        )
    })
}
