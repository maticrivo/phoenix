
/* HELPERS */

const ICON_GRAY = Image.fromFile ( '~/.config/phoenix/icons/search_gray.png' );
const ICON_GREEN = Image.fromFile ( '~/.config/phoenix/icons/search_green.png' );
const ICON_YELLOW = Image.fromFile ( '~/.config/phoenix/icons/search_yellow.png' );
const ICON_RED = Image.fromFile ( '~/.config/phoenix/icons/search_red.png' );

const STATE = {};

/* SPOTLIGHT */

//TODO: Document this in the readme

const onToggle = () => {

  if ( STATE.modal ) {

    onClose ();

  } else {

    onOpen ();

  }

};

const onOpen = () => { //TODO: Maybe make an helper out of most of this

  const screen = getFocusedScreen ();
  const frame = screen.frame ();

  STATE.time = Date.now ();

  STATE.modal = Modal.build ({
    weight: MODAL_WEIGHT,
    animationDuration: MODAL_INPUT_ANIMATION_DURATION,
    appearance: 'dark',
    inputPlaceholder: 'Search...',
    isInput: true,
    icon: ICON_GRAY,
    origin ( mFrame ) {
      return {
        x: frame.x + ( frame.width / 2 ) - ( mFrame.width / 2 ),
        y: frame.y + ( frame.height / 2 ) - ( mFrame.height / 2 )
      };
    },
    textDidChange: onSearch
  });

  STATE.modal.show ();

  STATE.onExitId = Key.on ( 'escape', [], onEscape );
  STATE.onEnterId = Key.on ( 'return', [], onEnter );

};

const onClose = () => {

  STATE.modal.close ();
  STATE.modal = undefined;

  STATE.apps = [];

  Key.off ( STATE.onExitId );
  Key.off ( STATE.onEnterId );

};

const onBlur = () => { //FIXME: This event isn't fired after the first one, for some reason

  if ( !STATE.modal ) return;

  if ( STATE.time > ( Date.now () - 100 ) ) return;

  onClose ();

};

const onSearch = query => {

  if ( !query ) {

    STATE.apps = [];

    STATE.modal.icon = ICON_GRAY;

  } else {

    STATE.apps = getApps ().filter ( app => isMatch ( app.name, query, true ) );

    if ( STATE.apps.length === 0 ) {

      STATE.modal.icon = ICON_RED;

    } else if ( STATE.apps.length === 1 ) {

      STATE.modal.icon = ICON_GREEN;

    } else {

      STATE.modal.icon = ICON_YELLOW;

    }

  }

};

const onTrigger = () => {

  const app = STATE.apps[0];

  if ( !app ) return;

  shell ( `open "${app.path}"` );

};

const onEscape = () => {

  onClose ();

};

const onEnter = () => {

  onTrigger ();
  onClose ();

};

Key.on ( 'space', ['ctrl'], onToggle );

setEventHandler ( 'windowDidFocus', onBlur);
