import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import {createStore} from 'redux'

let reducer = function a(state, action) {
	switch (action.type) {
		case 'ADD': {
			return {
				num: state.num + 1
			}
		}
		case 'SUB': {
			return {
				num: state.num - 1
			}
		}
		default :
			return {
				num: 0
			}
	}
}

let store = createStore(reducer)

let render = () => {
	ReactDOM.render(
		<App store={store}/>,
		document.getElementById('app')
	)
}

render()
store.subscribe(() => {
	render()
})
















