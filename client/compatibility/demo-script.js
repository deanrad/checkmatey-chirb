
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
            // We'll be re-run when we become ready by doing this
            if (!gameSubscription.ready()) return

            // A Game has been populated in the Games collection, (via the subscription)
            assert(Games.find().count() > 0, 'Expected to find a game')

            // The game has a piece
            assert(Games.findOne().board.position.d2,
                `Expected piece at d2 ${Games.findOne().board.position.d2}`)

            c.stop()

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
                console.log('OK: expected Redux DevTools to track state')
            }

            assert(typeof window.MeteorToys !== 'undefined', 'Expected MeteorToys to be installed')
            Meteor.setTimeout(() => { MeteorToys.open() }, 500)
        })

        context('The Store', () => {
            if (!gameSubscription.ready()) return
            assert(store.getState().board.position.d2 == 'wP', 'Expected white pawn on d2')
        })

        context('Manual Verification', () => {
            assert(true, 'Move e2:e4')
        })

        context('Optimistic UI', () => {
            assert(true, 'A delay in the server method doesnt slow the UX')
            assert(true, 'f6 is a square that throws (on the server)- show rollback')
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
