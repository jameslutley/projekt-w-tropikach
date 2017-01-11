/* globals window Modernizr */

export default function toggleOverlay() {
  const overlay = document.querySelector('.c-navigation__overlay');
  const transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend',
  };
  const transEndEventName = transEndEventNames[window.Modernizr.prefixed('transition')];
  const support = {
    transitions: window.Modernizr.csstransitions,
  };

  if (overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    overlay.classList.add('close');
    const onEndTransitionFn = (ev) => {
      if (support.transitions) {
        if (ev.propertyName !== 'visibility') return;
        this.removeEventListener(transEndEventName, onEndTransitionFn);
      }
      overlay.classList.remove('close');
    };
    if (support.transitions) {
      overlay.addEventListener(transEndEventName, onEndTransitionFn);
    } else {
      onEndTransitionFn();
    }
  } else if (!overlay.classList.contains('close')) {
    overlay.classList.add('open');
  }
}
