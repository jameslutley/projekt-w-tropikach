/* globals window Modernizr imagesloaded */

/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */

export default function imageGridEffects() {
  const support = {
    transitions: window.Modernizr.csstransitions,
  };

  // transition end event name
  const transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend',
  };

  const transEndEventName = transEndEventNames[window.Modernizr.prefixed('transition')];

  const onEndTransition = (el, callback) => {
    const onEndCallbackFn = function (ev) {
      if (support.transitions) {
        if (ev.target !== this) return;
        this.removeEventListener(transEndEventName, onEndCallbackFn);
      }
      if (callback && typeof callback === 'function') {
        callback.call(this);
      }
    };
    if (support.transitions) {
      el.addEventListener(transEndEventName, onEndCallbackFn);
    } else {
      onEndCallbackFn();
    }
  };

  /**
   * some helper functions
   */

  function throttle(fn, delay) {
    let allowSample = true;

    return (e) => {
      if (allowSample) {
        allowSample = false;
        setTimeout(() => {
          allowSample = true;
        }, delay);
        fn(e);
      }
    };
  }

  function nextSibling(el) {
    let nextSibling = el.nextSibling;
    while (nextSibling && nextSibling.nodeType !== 1) {
      nextSibling = nextSibling.nextSibling;
    }
    return nextSibling;
  }

  function extend(a, b) {
    for (const key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * GridFx obj
   */
  class GridFx {
    constructor(el, options) {
      this.gridEl = el;
      this.options = extend({}, this.options);
      extend(this.options, options);

      this.items = [].slice.call(this.gridEl.querySelectorAll('.grid__item'));
      this.previewEl = nextSibling(this.gridEl);
      this.isExpanded = false;
      this.isAnimating = false;
      this.closeCtrl = this.previewEl.querySelector('button.action--close');
      this.previewDescriptionEl = this.previewEl.querySelector('.description--preview');

      this._init();
    }

    _init() {
      // callback
      this.options.onInit(this);

      const self = this;
      // init masonry after all images are loaded
      window.imagesLoaded(this.gridEl, () => {
        // initialize masonry
        // new Masonry(self.gridEl, {
        //     itemSelector: '.grid__item',
        //     isFitWidth: true
        // });
        // show grid after all images (thumbs) are loaded
        self.gridEl.classList.add('grid--loaded');
        // init/bind events
        self._initEvents();
        // create the large image and append it to the DOM
        self._setOriginal();
        // create the clone image and append it to the DOM
        self._setClone();
      });
    }

    /**
     * initialize/bind events
     */
    _initEvents() {
      const self = this;
      const clickEvent = (document.ontouchstart !== null ? 'click' : 'touchstart');

      this.items.forEach((item) => {
        const touchend = (ev) => {
          ev.preventDefault();
          self._openItem(ev, item);
          item.removeEventListener('touchend', touchend);
        };

        const touchmove = (ev) => {
          item.removeEventListener('touchend', touchend);
        };

        const manageTouch = () => {
          item.addEventListener('touchend', touchend);
          item.addEventListener('touchmove', touchmove);
        };

        item.addEventListener(clickEvent, (ev) => {
          if (clickEvent === 'click') {
            ev.preventDefault();
            self._openItem(ev, item);
          } else {
            manageTouch();
          }
        });
      });

      // close expanded image
      this.closeCtrl.addEventListener('click', () => {
        self._closeItem();
      });

      window.addEventListener('resize', throttle(ev => {
        // callback
        self.options.onResize(self);
      }, 10));
    }

    /**
     * open a grid item
     */
    _openItem(ev, item) {
      if (this.isAnimating || this.isExpanded) return;
      this.isAnimating = true;
      this.isExpanded = true;

      // item's image
      const gridImg = item.querySelector('img');

      const gridImgOffset = gridImg.getBoundingClientRect();

      // index of current item
      this.current = this.items.indexOf(item);

      // set the src of the original image element (large image)
      this._setOriginal(item.querySelector('a').getAttribute('href'));

      // callback
      this.options.onOpenItem(this, item);

      // set the clone image
      this._setClone(gridImg.src, {
        width: gridImg.offsetWidth,
        height: gridImg.offsetHeight,
        left: gridImgOffset.left,
        top: gridImgOffset.top,
      });

      // hide original grid item
      item.classList.add('grid__item--current');

      // calculate the transform value for the clone to animate to the full image view
      const win = this._getWinSize();

      const originalSizeArr = item.getAttribute('data-size').split('x');

      const originalSize = {
        width: originalSizeArr[0],
        height: originalSizeArr[1],
      };

      const dx = ((this.options.imgPosition.x > 0 ? 1 - Math.abs(this.options.imgPosition.x) : Math.abs(this.options.imgPosition.x)) * win.width + this.options.imgPosition.x * win.width / 2) - gridImgOffset.left - 0.5 * gridImg.offsetWidth;
      const dy = ((this.options.imgPosition.y > 0 ? 1 - Math.abs(this.options.imgPosition.y) : Math.abs(this.options.imgPosition.y)) * win.height + this.options.imgPosition.y * win.height / 2) - gridImgOffset.top - 0.5 * gridImg.offsetHeight;
      const z = Math.min(Math.min(win.width * Math.abs(this.options.imgPosition.x) - this.options.pagemargin, originalSize.width - this.options.pagemargin) / gridImg.offsetWidth, Math.min(win.height * Math.abs(this.options.imgPosition.y) - this.options.pagemargin, originalSize.height - this.options.pagemargin) / gridImg.offsetHeight);

      // apply transform to the clone
      this.cloneImg.style.WebkitTransform = `translate3d(${dx}px, ${dy}px, 0) scale3d(${z}, ${z}, 1)`;
      this.cloneImg.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale3d(${z}, ${z}, 1)`;

      // add the description if any
      const descriptionEl = item.querySelector('.description');
      if (descriptionEl) {
        this.previewDescriptionEl.innerHTML = descriptionEl.innerHTML;
      }

      const self = this;
      setTimeout(() => {
        // controls the elements inside the expanded view
        self.previewEl.classList.add('preview--open');
        // callback
        self.options.onExpand();
      }, 0);

      // after the clone animates..
      onEndTransition(this.cloneImg, () => {
        // when the original/large image is loaded..
        window.imagesLoaded(self.originalImg, () => {
          // close button just gets shown after the large image gets loaded
          self.previewEl.classList.add('preview--image-loaded');
          // animate the opacity to 1
          self.originalImg.style.opacity = 1;
          // and once that's done..
          onEndTransition(self.originalImg, () => {
            // reset cloneImg
            self.cloneImg.style.opacity = 0;
            self.cloneImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
            self.cloneImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

            self.isAnimating = false;
          });
        });
      });
    }

    /**
     * create/set the original/large image element
     */
    _setOriginal(src) {
      if (!src) {
        this.originalImg = document.createElement('img');
        this.originalImg.className = 'original';
        this.originalImg.style.opacity = 0;
        this.originalImg.style.maxWidth = `calc(${parseInt(Math.abs(this.options.imgPosition.x) * 100, 10)}vw - ${this.options.pagemargin}px)`;
        this.originalImg.style.maxHeight = `calc(${parseInt(Math.abs(this.options.imgPosition.y) * 100, 10)}vh - ${this.options.pagemargin}px)`;
        // need it because of firefox
        this.originalImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
        this.originalImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';
        src = '';
        this.previewEl.appendChild(this.originalImg);
      }

      this.originalImg.setAttribute('src', src);
    }

    /**
     * create/set the clone image element
     */
    _setClone(src, settings) {
      if (!src) {
        this.cloneImg = document.createElement('img');
        this.cloneImg.className = 'clone';
        src = '';
        this.cloneImg.style.opacity = 0;
        this.previewEl.appendChild(this.cloneImg);
      } else {
        this.cloneImg.style.opacity = 1;
        // set top/left/width/height of grid item's image to the clone
        this.cloneImg.style.width = `${settings.width}px`;
        this.cloneImg.style.height = `${settings.height}px`;
        this.cloneImg.style.top = `${settings.top}px`;
        this.cloneImg.style.left = `${settings.left}px`;
      }

      this.cloneImg.setAttribute('src', src);
    }

    /**
     * closes the original/large image view
     */
    _closeItem() {
      if (!this.isExpanded || this.isAnimating) return;
      this.isExpanded = false;
      this.isAnimating = true;

      // the grid item's image and its offset
      const gridItem = this.items[this.current];

      const gridImg = gridItem.querySelector('img');
      const gridImgOffset = gridImg.getBoundingClientRect();
      const self = this;

      this.previewEl.classList.remove('preview--open');
      this.previewEl.classList.remove('preview--image-loaded');

      // callback
      this.options.onCloseItem(this, gridItem);

      // large image will animate back to the position of its grid's item
      this.originalImg.classList.add('animate');

      // set the transform to the original/large image
      const win = this._getWinSize();

      const dx = gridImgOffset.left + gridImg.offsetWidth / 2 - ((this.options.imgPosition.x > 0 ? 1 - Math.abs(this.options.imgPosition.x) : Math.abs(this.options.imgPosition.x)) * win.width + this.options.imgPosition.x * win.width / 2);
      const dy = gridImgOffset.top + gridImg.offsetHeight / 2 - ((this.options.imgPosition.y > 0 ? 1 - Math.abs(this.options.imgPosition.y) : Math.abs(this.options.imgPosition.y)) * win.height + this.options.imgPosition.y * win.height / 2);
      const z = gridImg.offsetWidth / this.originalImg.offsetWidth;

      this.originalImg.style.WebkitTransform = `translate3d(${dx}px, ${dy}px, 0) scale3d(${z}, ${z}, 1)`;
      this.originalImg.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale3d(${z}, ${z}, 1)`;

      // once that's done..
      onEndTransition(this.originalImg, () => {
        // clear description
        self.previewDescriptionEl.innerHTML = '';

        // show original grid item
        gridItem.classList.remove('grid__item--current');

        // fade out the original image
        setTimeout(() => {
          self.originalImg.style.opacity = 0;
        }, 60);

        // and after that
        onEndTransition(self.originalImg, () => {
          // reset original/large image
          self.originalImg.classList.remove('animate');
          self.originalImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
          self.originalImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

          self.isAnimating = false;
        });
      });
    }

    /**
     * gets the window sizes
     */
    _getWinSize() {
      return {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
      };
    }
  }

  /**
   * options
   */
  GridFx.prototype.options = {
    pagemargin: 0,
    // x and y can have values from 0 to 1 (percentage). If negative then
    // it means the alignment is left and/or top rather than right and/or bottom
    // so, as an example, if we want our large image to be positioned vertically on 25%
    // of the screen and centered horizontally the values would be x:1,y:-0.25
    imgPosition: {
      x: 1,
      y: 1,
    },
    onInit(instance) {
      return false;
    },
    onResize(instance) {
      return false;
    },
    onOpenItem(instance, item) {
      return false;
    },
    onCloseItem(instance, item) {
      return false;
    },
    onExpand() {
      return false;
    },
  };

  window.GridFx = GridFx;
}
