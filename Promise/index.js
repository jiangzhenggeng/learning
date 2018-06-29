function resolvePromise(promise2, x, resolve, resject) {
	if (promise2 === x) {
		return reject(new TypeError('Chaining cycle detected for promise'));
	}

	let called = false
	if (x != null && (typeof x === 'object' || typeof x === 'function')) {
		try {
			let then = x.then
			if (typeof then === 'function') {
				then.call(x, y => {
					if (called) return
					called = true
					resolvePromise(promise2, y, resolve, resject)
				}, err => {
					if (called) return
					called = true
					resject(err)
				})
			} else {
				resolve(x)
			}
		} catch (err) {
			if (called) return
			called = true
			resject(err)
		}
	} else {
		resolve(x)
	}
}

class Promise {

	static race(promises) {
		return new Promise((resolve, reject) => {
			(promises || []).forEach(promise => {
				promise.then(resolve, reject)
			})
		})
	}

	static all(promises) {
		let arr = [];
		let i = 0;
		let _resolve

		function processData(index, data) {
			arr[index] = data;
			i++;
			console.log(i == promises.length, typeof _resolve)
			if (i == promises.length) {
				_resolve(arr);
			}
			;
		};
		return new Promise((resolve, reject) => {
			_resolve = resolve
			for (let i = 0; i < promises.length; i++) {
				promises[i].then(data => {
					processData(i, data);
				}, reject);
			}
			;
		});

	}

	static resolve(value) {
		return new Promise((resolve, reject) => {
			resolve(value)
		})
	}

	static reject(value) {
		return new Promise((resolve, reject) => {
			reject(value)
		})
	}

	constructor(exec) {
		this.state = 'pending'
		this.value = undefined
		this.reason = undefined

		this.onResolveCallbacks = []
		this.onRejectCallbacks = []

		let resolve = (value) => {
			if (this.state === 'pending') {
				this.state = 'fulfilled'
				this.value = value
				this.onResolveCallbacks.forEach(fn => fn())
			}
		}
		let reject = (value) => {
			if (this.state === 'pending') {
				this.state = 'rejected'
				this.reason = value
				this.onRejectCallbacks.forEach(fn => fn())
			}
		}
		try {
			exec(resolve, reject)
		} catch (err) {
			reject(err)
		}
	}

	then(onResolve, onReject) {
		onResolve = typeof onResolve === 'function' ? onResolve : value => value;
		onReject = typeof onReject === 'function' ? onReject : err => {
			throw err
		};

		let promise2 = new Promise((resolve, reject) => {

			if (this.state === 'fulfilled') {
				setTimeout(() => {
					try {
						let x = onResolve(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (err) {
						reject(err)
					}
				})
			}

			if (this.state === 'rejected') {
				setTimeout(() => {
					try {
						let x = onReject(this.value)
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
							let x = onResolve(this.value)
							resolvePromise(promise2, x, resolve, reject)
						} catch (err) {
							reject(err)
						}
					})
				})
				this.onRejectCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onReject(this.reason)
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


Promise['all']([
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
			reject(3)
		}, 3000)
	})
]).then((arr) => {
	console.log(arr)
}).then((arr) => {
	console.log('2222')
}).then((arr) => {
	console.log('3333')
}).catch((err) => {
	console.log(err)
})






































