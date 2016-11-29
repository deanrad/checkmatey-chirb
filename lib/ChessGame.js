/* global: window.ChessBoard */
import React from 'react'

const chessboardId = 'chessboard-js'

// The ChessBoard component we're defining is rerendered with each new board.
// Each time this happens, we tell the chessboard.js library (window.ChessBoard)
// what the new position is, and rebind the drop handlers it uses.
//
let rebindChessBoard = ({ board, dropHandler }) => {
    let { position } = board

    // eslint-disable-next-line no-new
    new window.ChessBoard(chessboardId, {
        draggable: true,
        position: position,
        onDrop: dropHandler
    })
}

// React Terminology:
// A Component is a function returning parameterized virtual DOM elements.
//
// A React driver (React-DOM) will diff these returned DOM elements against the real DOM
// and issue imperative updates to bring it into sync with what the component's returned
// element tree looks like. Not much different than double-buffering in computer graphics.
//
// Encapsulation is achieved this way:
// - React does not know how you derive your element tree, or how often you will re-render
// - Your components don't reference the state of the DOM, only component {props} and state.
// - Data structures are descriptions of what should be; not prescribed changes.
//
// A component may be rendered through a class-based render(), or by returning them directly
// as below:
export default class ChessGame extends React.Component {
    // Lifecycle hooks to reinitialize the 3rd party chess lib
    componentDidMount() {
        console.log('R> ComponentDidMount')
        rebindChessBoard(this.props)
    }

    componentDidUpdate() {
        console.log('R> ComponentDidUpdate')
        rebindChessBoard(this.props)
    }

    render() {
        return (
            <div style={{ width: '100%', marginTop: 60 }}>
                <center>
                    <h1>How about a nice game of Chess?</h1>
                    <div id={ chessboardId } style={{ width: 600 }}></div>
                </center>
            </div>
        )
    }
}
