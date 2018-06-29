import './setrem'

function resolvePromise(promise2, x, resovle, reject) {
	if (promise2 === x) {
		reject(new TypeError('Chaining cycle detected for promise'))
	}
	let called
	if (x != null && (typeof x == 'object' || typeof x == 'function')) {
		try {
			let then = x.then
			if (typeof then == 'function') {
				then.call(x, y => {
					if (called) return
					called = true
					resolvePromise(promise2, y, resovle, reject)
				}, err => {
					if (called) return
					called = true
					reject(err)
				})
			} else {
				resovle(x)
			}
		} catch (err) {
			reject(err)
		}
	} else {
		resovle(x)
	}

}

class Promise {
	constructor(executor) {
		this.state = 'pending'
		this.value = undefined
		this.reason = undefined

		this.onResolveCallbacks = []
		this.onRejectCallbacks = []

		let resolve = (val) => {
			if (this.state === 'pending') {
				this.state = 'fulfilled'
				this.value = val
				this.onResolveCallbacks.forEach((fn) => {
					fn()
				})
			}
		}
		let reject = (val) => {
			if (this.state === 'pending') {
				this.state = 'rejected'
				this.reason = val
				this.onRejectCallbacks.forEach((fn) => {
					fn()
				})
			}
		}
		try {
			executor(resolve, reject)
		} catch (err) {
			reject(err)
		}
	}

	then(onFulfilled, onRejected) {
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
		onRejected = typeof onRejected === 'function' ? onRejected : value => {
			throw value
		}
		let promise2 = new Promise((resolve, reject) => {
			if (this.state === 'fulfilled') {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (err) {
						reject(err)
					}
				})
			}
			if (this.state === 'rejected') {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					} catch (err) {
						reject(err)
					}
				})
			}
			if (this.state === 'pending') {
				this.onResolveCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onFulfilled(this.value)
							resolvePromise(promise2, x, resolve, reject)
						} catch (err) {
							reject(err)
						}
					})
				})
				this.onRejectCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onRejected(this.reason)
							resolvePromise(promise2, x, resolve, reject)
						} catch (err) {
							reject(err)
						}
					})
				})
			}
		})

		return promise2
	}

	catch(fn) {
		return this.then(null, fn)
	}
}

Promise.resolve = function (val) {
	return new Promise((resolve) => {
		resolve(val)
	})
}

Promise.reject = function (val) {
	return new Promise((resolve, reject) => {
		reject(val)
	})
}

Promise.race = function (promises) {
	return new Promise((resolve, reject) => {
		(promises || []).forEach((promise) => {
			promise.then(resolve, reject)
		})
	})
}

Promise.all = function (promises) {
	let num = 0
	let resultArr = []
	return new Promise((resolve, reject) => {
		(promises || []).forEach((promise, index) => {
			promise.then((data) => {
				resultArr[index] = data
				num++
				if (num == promises.length) {
					resolve(resultArr)
				}
			}, reject)
		})
	})
}

// let promise = new Promise((resolve, reject) => {
// 	console.log(1)
// 	setTimeout(() => {
// 		resolve(2)
// 	}, 3000)
//
// })

Promise['race']([
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(1)
		}, 1000)

	}),
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(2)
		}, 2000)
	}),
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(3)
		}, 3000)
	})
]).then((arr) => {
	console.log(arr)
})























