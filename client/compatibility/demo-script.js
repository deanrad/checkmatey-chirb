
window.assert = (val, msg) => {
    if (!val)
        throw new Error(msg + ":" + val)
    else
        console.log('OK: ' + msg)
}

const context = (name, impl) => {
    Tracker.autorun(() => {
        console.log('Context: ' + name)
        impl.call(null)
    })
}

window.testIt = () => {
    try {
        context('Subscriptions are ready', () => {
            // We'll be re-run when we become ready by doing this
            if (!gameSubscription.ready()) return

            // A Game has been populated in the Games collection, (via the subscription)
            assert(Games.find().count() > 0, 'Expected to find a game')

            // The game has a piece
            assert(Games.findOne().board.position.d2,
                `Expected piece at d2 ${Games.findOne().board.position.d2}`)

        })

        // Stopping a subscription removes records (must demo manually)
        context('Stopping a subscription removes records', () => {
            // gameSubscription.stop()
            // assert(Games.find().count() === 0, 'Expected to find no games after stopping')
        })

        context('Debug Tooling', () => {
            if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'function') {
                console.log('WARN: expected __REDUX_DEVTOOLS_EXTENSION__. Please install Redux DevTools')
            } else {
                console.log('OK: expected Redux DevTools')
            }

            assert(typeof window.MeteorToys !== 'undefined', 'Expected MeteorToys to be installed')
            MeteorToys.open()
        })

        console.log('YAY all tests pass (TODO throw exception if not)')
    } catch (err) {
        console.log('Tests Failed: ', err)
    }
}

Meteor.startup(window.testIt)
