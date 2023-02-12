
/* SWITCH SPACE */

function switchSpace ( modifier, wrap = SPACES_SWITCH_WRAP ) {

  const spaces = Space.all ();

  if ( spaces.length < 2 ) return; // Nothing to switch to

  const activeSpace = Space.active ();
  const activeIndex = getSpaceIndex ( activeSpace );

  let nextIndex = activeIndex + modifier;

  if ( nextIndex < 0 || nextIndex >= spaces.length ) {

    if ( !wrap ) return;

    nextIndex = ( nextIndex < 0 ) ? spaces.length + nextIndex : nextIndex % spaces.length;

  }

  const script = `tell application "System Events" to key code {${index2keycode ( nextIndex )}} using {control down, option down, command down, shift down}`;

  setTimeout ( () => osascript ( script ), 250 ); //FIXME: https://github.com/kasper/phoenix/issues/206

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
