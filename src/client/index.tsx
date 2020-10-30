import "./index.scss";
import React from 'react'
import ReactDOM from 'react-dom'
import {Game} from "./Game"

window.addEventListener('load', () => {
    ReactDOM.render(
        <Game/>,
        document.getElementById('root'),
    )
})
