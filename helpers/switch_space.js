
/* SWITCH SPACE */

function switchSpace ( modifier ) {

	// Move focused window to the next/prev space and focus to the space (macOS 12.0+)
	const space = Space.active();
	if (space.isNormal()) {
		const window = Window.focused();
		let moveToSpace = space[modifier === 1 ? 'next' : 'previous']()
		let i = 0;
		while (!moveToSpace.isNormal() && i < 10) {
			moveToSpace = moveToSpace[modifier === 1 ? 'next' : 'previous']()
			i++
		}
		if (moveToSpace.isNormal()) {
			moveToSpace.moveWindows([window]);
		} else {
			alert ( "Can't find a space to move the window" );
		}
		window.focus();
	}
}
