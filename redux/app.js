import React from 'react'

export default class App extends React.Component {

	// 构造
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h1>{this.props.store.getState().num}</h1>
				<button onClick={this.add.bind(this)}>+</button>
				<button onClick={this.sub.bind(this)}>-</button>
			</div>
		)

	}

	add() {
		this.props.store.dispatch({
			type: 'ADD'
		})
	}

	sub() {
		this.props.store.dispatch({
			type: 'SUB'
		})
	}

	componentWillReceiveProps() {
		console.log(arguments)
	}
}















