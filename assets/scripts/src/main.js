/* globals smoothScroll */

import toggleOverlay from './modules/responsive-navigation';
import imageGridEffects from './modules/image-grid-effects';
import facebookLikeButton from './modules/facebook-like-button';
import mailchimpNewsletterSignup from './modules/mailchimp-newsletter-signup';

// Require legacy scripts and AMD modules
require('script-loader!../../../node_modules/lazysizes/lazysizes.js');
require('script-loader!../../../node_modules/smooth-scroll/dist/js/smooth-scroll.js');
require('script-loader!../../../node_modules/imagesloaded/imagesloaded.pkgd.js');

// Smooth Scroll
const overlay = document.querySelector('.c-navigation__overlay');

smoothScroll.init({
  speed: 800,
  easing: 'easeInOutQuart',
  callback: () => {
    overlay.classList.remove('open');
  },
});

// Responsive Navigation
// responsiveNavigation();
const overlayMediaQuery = window.matchMedia('@media all and (max-width: 767px)');
const triggerBttn = document.querySelector('.c-navigation__overlay-trigger');
const closeBttn = overlay.querySelector('button.c-navigation__overlay-close');

if (!overlayMediaQuery.matches) {
  triggerBttn.addEventListener('click', toggleOverlay);
  closeBttn.addEventListener('click', toggleOverlay);
}

// Facebook Like Button
const fbRoot = document.createElement('div');
fbRoot.id = 'fb-root';
document.body.appendChild(fbRoot);

facebookLikeButton(document, 'script', 'facebook-jssdk');

// Mailchimp Newsletter Signup
const newsletter = document.querySelector('#mc_embed_signup');
newsletter.addEventListener('submit', mailchimpNewsletterSignup);

// Image Gallery
imageGridEffects();

const support = {
  transitions: window.Modernizr.csstransition,
};

// Transition end event name
const transEndEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd',
  transition: 'transitionend',
};

const transEndEventName = transEndEventNames[window.Modernizr.prefixed('transition')];

const onEndTransition = (el, callback) => {
  const onEndCallbackFn = function(ev) {
    if (support.transitions) {
      if (ev.target !== this) return;
      this.removeEventListener(transEndEventName, onEndCallbackFn);
    }
    if (callback && typeof callback === 'function') { callback.call(this); }
  };
  if (support.transitions) {
    el.addEventListener(transEndEventName, onEndCallbackFn);
  } else {
    onEndCallbackFn();
  }
};

new GridFx(document.querySelector('.grid'), {
  imgPosition: {
    x: 1,
    y: 0.75,
  },
  pagemargin: 50,
  onOpenItem(instance, item) {
    instance.items.forEach((el) => {
      if (item !== el) {
        const delay = Math.floor(Math.random() * 150);
        el.style.WebkitTransition = `opacity .4s ${delay}ms cubic-bezier(.7,0,.3,1), -webkit-transform .4s ${delay}ms cubic-bezier(.7,0,.3,1)`;
        el.style.transition = `opacity .4s ${delay}ms cubic-bezier(.7,0,.3,1), transform .4s ${delay}ms cubic-bezier(.7,0,.3,1)`;

        el.style.WebkitTransform = 'translate3d(0,400px,0)';
        el.style.transform = 'translate3d(0,400px,0)';
        el.style.opacity = 0;
      }
    });
  },
  onCloseItem(instance, item) {
    instance.items.forEach((el) => {
      if (item !== el) {
        el.style.WebkitTransition = 'opacity .3s, -webkit-transform .3s';
        el.style.transition = 'opacity .3s, transform .3s';

        el.style.WebkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        el.style.opacity = 1;

        onEndTransition(el, () => {
          el.style.transition = 'none';
          el.style.WebkitTransform = 'none';
        });
      }
    });
  },
});
