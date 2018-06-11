import linkItem from './linkItem'

export default class linkList {
	constructor() {
		this.head = null
		this.tail = null
	}

	prepend(value) {
		this.head = new linkItem(value, this.head)
		return this
	}

	append(value) {
		let nodeValue = new linkItem(value)
		if (!this.head) {
			this.head = nodeValue
		} else {
			this.tail.next = nodeValue
		}
		this.tail = nodeValue
		return this
	}

	length() {
		if (!this.head) return 0
		let currntItem = this.head
		let length = 0
		while (currntItem) {
			length++
			currntItem = currntItem.next
		}
		return length
	}

	insert(value, position) {
		//查找位置合法
		if (position < 0 || position >= this.length()) return false
		let nodeValue = new linkItem(value)

		if (!this.head) {
			this.head = nodeValue
			this.tail = nodeValue
			return this
		}

		let currntItem = this.head
		let length = 0
		while (currntItem) {
			if (length == position) {
				nodeValue.next = currntItem.next
				currntItem.next = nodeValue
				break
			}
			currntItem = currntItem.next
			length++
		}
		return this
	}
}















