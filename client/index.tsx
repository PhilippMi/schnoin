import React from 'react'
import ReactDOM from 'react-dom'

console.log('Hello from tsx!')

window.addEventListener('load', () => {
    ReactDOM.render(
        <p>Hello</p>,
        document.getElementById('root'),
    )
})
