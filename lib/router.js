import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import ChessGame from './ChessGame'

// TODO make props dynamic
const initialPosition = {
    a8: 'bR', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bR',
    a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
    a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
    a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wR'
}

const chessGameProps = {
    board: {
        position: initialPosition
    },
    dropHandler: (from, to) => {
        console.log(`TODO move from ${from} to ${to}`)
    }
}

FlowRouter.route('/', {
    action() {
        mount(ChessGame, chessGameProps)
    }
})
