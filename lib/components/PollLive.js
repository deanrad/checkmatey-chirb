import React from 'react'
import { Link } from 'react-router'

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

let buttonStyle = {
    fontSize: '2rem',
    width: '300px'
}

export default ({ active, clients, advanceQuestion }) => {
    const prompt = ((active && active.prompt) || '')
    const choices = ((active && active.choices) || [])
    const responses = ((active && active.responses) || [])
    const imgSrc = (active && active.imgSrc)

    return (
        <div>
        Poll LIVE! <i>({ (clients || []).length } connected, { responses.length } responses ...)</i><br /><br />

        { imgSrc && <img style={{ float: 'right' }} src={imgSrc}/> }

        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Q: { prompt }
        </div>

        <div>
            {
                choices.map(choice => {
                    return (
                    <div key={ choice }>
                        { responses.filter(r => (r.choice === choice)).length } : { choice }
                    </div>
                    )
                })
            }
        </div>

        <br/><br/>

        Take the poll at <a href="http://bit.ly/chirb-now">http://bit.ly/chirb-now</a>

        </div>
    )
}
