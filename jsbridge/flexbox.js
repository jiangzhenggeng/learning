function setRemUnit() {
	document.documentElement.style.fontSize = window.screen.width / 10 + 'px'
}

window.addEventListener('resize', setRemUnit)
window.addEventListener('pageshow', function (e) {
	if (e.persisted) {
		setRemUnit()
	}
})

setRemUnit()
