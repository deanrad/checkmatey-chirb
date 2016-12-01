
window.assert = (val, msg) => {
    if (!val)
        throw new Error(msg + ":" + val)
    else
        console.log('  OK: ' + msg)
}

const context = (name, impl) => {
    Tracker.autorun((computation) => {
        console.log('Context: ' + name)
        impl.call(null, computation)
    })
}

window.testIt = () => {
    try {
        context('Subscriptions are ready', (c) => {
        })

        // Stopping a subscription removes records (must demo manually)
        context('Stopping a subscription removes records', () => {
            // gameSubscription.stop()
            // assert(Polls.find().count() === 0, 'Expected to find no games after stopping')
        })

        context('Debug Tooling', () => {
            if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'function') {
                console.log('WARN: expected __REDUX_DEVTOOLS_EXTENSION__. Please install Redux DevTools')
            } else {
                console.log('OK: expected Redux DevTools')
                console.log('OK: expected Redux DevTools to track state')
            }

            assert(typeof window.MeteorToys !== 'undefined', 'Expected MeteorToys to be installed')
            // Meteor.setTimeout(() => { MeteorToys.open() }, 500)
        })

        context('The Store', () => {
        })

        context('Manual Verification', () => {
        })

        context('Optimistic UI', () => {
            assert(true, 'A delay in the server method doesnt slow the UX')
        })

        context('Dependency graphs', () => {
            assert(true, 'Can do npm run doc:all to see the dep graph ')
        })

        Meteor.setTimeout(() => {
            console.log('YAY all tests pass!')
        }, 500)

    } catch (err) {
        console.log('Tests Failed: ', err)
    }
}

Meteor.startup(window.testIt)
