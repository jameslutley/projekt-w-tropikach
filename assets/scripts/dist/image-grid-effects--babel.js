(c=>{/**
     * some helper functions
     */function d(l,m){let n=!0;return o=>{n&&(n=!1,setTimeout(()=>{n=!0},m),l(o))}}function f(l){let m=l.nextSibling;for(;m&&1!=m.nodeType;)m=m.nextSibling;return m}function g(l,m){for(const n in m)m.hasOwnProperty(n)&&(l[n]=m[n]);return l}/**
     * GridFx obj
     */const h={transitions:Modernizr.csstransitions},i={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd',msTransition:'MSTransitionEnd',transition:'transitionend'}[Modernizr.prefixed('transition')],j=(l,m)=>{const n=function(o){if(h.transitions){if(o.target!=this)return;this.removeEventListener(i,n)}m&&'function'==typeof m&&m.call(this)};h.transitions?l.addEventListener(i,n):n()};// transition end event name
class k{constructor(l,m){this.gridEl=l,this.options=g({},this.options),g(this.options,m),this.items=[].slice.call(this.gridEl.querySelectorAll('.c-img-grid__item')),this.previewEl=f(this.gridEl),this.isExpanded=!1,this.isAnimating=!1,this.closeCtrl=this.previewEl.querySelector('button.c-img-grid__action--close'),this.previewDescriptionEl=this.previewEl.querySelector('.c-img-grid__description--preview'),this._init()}_init(){this.options.onInit(this);const l=this;// init masonry after all images are loaded
imagesLoaded(this.gridEl,()=>{new Masonry(l.gridEl,{itemSelector:'.c-img-grid__item',isFitWidth:!0}),l.gridEl.classList.add('c-img-grid__grid--loaded'),l._initEvents(),l._setOriginal(),l._setClone()})}/**
         * initialize/bind events
         */_initEvents(){const l=this,m=null===document.ontouchstart?'touchstart':'click';this.items.forEach(n=>{const o=r=>{r.preventDefault(),l._openItem(r,n),n.removeEventListener('touchend',o)},p=()=>{n.removeEventListener('touchend',o)},q=()=>{n.addEventListener('touchend',o),n.addEventListener('touchmove',p)};n.addEventListener(m,r=>{'click'==m?(r.preventDefault(),l._openItem(r,n)):q()})}),this.closeCtrl.addEventListener('click',()=>{l._closeItem()}),c.addEventListener('resize',d(()=>{l.options.onResize(l)},10))}/**
         * open a grid item
         */_openItem(l,m){if(!(this.isAnimating||this.isExpanded)){this.isAnimating=!0,this.isExpanded=!0;// item's image
const x=m.querySelector('img'),y=x.getBoundingClientRect();// index of current item
this.current=this.items.indexOf(m),this._setOriginal(m.querySelector('a').getAttribute('href')),this.options.onOpenItem(this,m),this._setClone(x.src,{width:x.offsetWidth,height:x.offsetHeight,left:y.left,top:y.top}),m.classList.add('c-img-grid__item--current');// calculate the transform value for the clone to animate to the full image view
const A=this._getWinSize(),B=m.getAttribute('data-size').split('x'),C={width:B[0],height:B[1]},D=(0<this.options.imgPosition.x?1-Math.abs(this.options.imgPosition.x):Math.abs(this.options.imgPosition.x))*A.width+this.options.imgPosition.x*A.width/2-y.left-0.5*x.offsetWidth,E=(0<this.options.imgPosition.y?1-Math.abs(this.options.imgPosition.y):Math.abs(this.options.imgPosition.y))*A.height+this.options.imgPosition.y*A.height/2-y.top-0.5*x.offsetHeight,F=Math.min(Math.min(A.width*Math.abs(this.options.imgPosition.x)-this.options.pagemargin,C.width-this.options.pagemargin)/x.offsetWidth,Math.min(A.height*Math.abs(this.options.imgPosition.y)-this.options.pagemargin,C.height-this.options.pagemargin)/x.offsetHeight);// apply transform to the clone
this.cloneImg.style.WebkitTransform=`translate3d(${D}px, ${E}px, 0) scale3d(${F}, ${F}, 1)`,this.cloneImg.style.transform=`translate3d(${D}px, ${E}px, 0) scale3d(${F}, ${F}, 1)`;// add the description if any
const G=m.querySelector('.c-img-grid__description');G&&(this.previewDescriptionEl.innerHTML=G.innerHTML);const H=this;setTimeout(()=>{H.previewEl.classList.add('preview--open'),H.options.onExpand()},0),j(this.cloneImg,()=>{imagesLoaded(H.originalImg,()=>{H.previewEl.classList.add('c-img-grid__preview--image-loaded'),H.originalImg.style.opacity=1,j(H.originalImg,()=>{H.cloneImg.style.opacity=0,H.cloneImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',H.cloneImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',H.isAnimating=!1})})})}// set the src of the original image element (large image)
// callback
// set the clone image
// hide original grid item
// classie.add(item, 'grid__item--current');
// after the clone animates..
}/**
         * create/set the original/large image element
         */_setOriginal(l){l||(this.originalImg=document.createElement('img'),this.originalImg.className='original',this.originalImg.style.opacity=0,this.originalImg.style.maxWidth=`calc(${parseInt(100*Math.abs(this.options.imgPosition.x))}vw - ${this.options.pagemargin}px)`,this.originalImg.style.maxHeight=`calc(${parseInt(100*Math.abs(this.options.imgPosition.y))}vh - ${this.options.pagemargin}px)`,this.originalImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',this.originalImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',l='',this.previewEl.appendChild(this.originalImg)),this.originalImg.setAttribute('src',l)}/**
         * create/set the clone image element
         */_setClone(l,m){l?(this.cloneImg.style.opacity=1,this.cloneImg.style.width=`${m.width}px`,this.cloneImg.style.height=`${m.height}px`,this.cloneImg.style.top=`${m.top}px`,this.cloneImg.style.left=`${m.left}px`):(this.cloneImg=document.createElement('img'),this.cloneImg.className='clone',l='',this.cloneImg.style.opacity=0,this.previewEl.appendChild(this.cloneImg)),this.cloneImg.setAttribute('src',l)}/**
         * closes the original/large image view
         */_closeItem(){if(this.isExpanded&&!this.isAnimating){this.isExpanded=!1,this.isAnimating=!0;// the grid item's image and its offset
const x=this.items[this.current],y=x.querySelector('img'),A=y.getBoundingClientRect(),B=this;// classie.remove(this.previewEl, 'preview--open');
this.previewEl.classList.remove('c-img-grid__preview--open'),this.previewEl.classList.remove('c-img-grid__preview--image-loaded'),this.options.onCloseItem(this,x),this.originalImg.classList.add('animate');// set the transform to the original/large image
const C=this._getWinSize(),D=A.left+y.offsetWidth/2-((0<this.options.imgPosition.x?1-Math.abs(this.options.imgPosition.x):Math.abs(this.options.imgPosition.x))*C.width+this.options.imgPosition.x*C.width/2),E=A.top+y.offsetHeight/2-((0<this.options.imgPosition.y?1-Math.abs(this.options.imgPosition.y):Math.abs(this.options.imgPosition.y))*C.height+this.options.imgPosition.y*C.height/2),F=y.offsetWidth/this.originalImg.offsetWidth;this.originalImg.style.WebkitTransform=`translate3d(${D}px, ${E}px, 0) scale3d(${F}, ${F}, 1)`,this.originalImg.style.transform=`translate3d(${D}px, ${E}px, 0) scale3d(${F}, ${F}, 1)`,j(this.originalImg,()=>{B.previewDescriptionEl.innerHTML='',x.classList.remove('c-img-grid__item--current'),setTimeout(()=>{B.originalImg.style.opacity=0},60),j(B.originalImg,()=>{B.originalImg.classList.remove('animate'),B.originalImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',B.originalImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',B.isAnimating=!1})})}// classie.remove(this.previewEl, 'preview--image-loaded');
// callback
// large image will animate back to the position of its grid's item
// classie.add(this.originalImg, 'animate');
// once that's done..
}/**
         * gets the window sizes
         */_getWinSize(){return{width:document.documentElement.clientWidth,height:c.innerHeight}}}/**
     * options
     */k.prototype.options={pagemargin:0,// x and y can have values from 0 to 1 (percentage). If negative then it means the alignment is left and/or top rather than right and/or bottom
// so, as an example, if we want our large image to be positioned vertically on 25% of the screen and centered horizontally the values would be x:1,y:-0.25
imgPosition:{x:1,y:1},onInit(){return!1},onResize(){return!1},onOpenItem(){return!1},onCloseItem(){return!1},onExpand(){return!1}},c.GridFx=k})(window),(()=>{const c={transitions:Modernizr.csstransitions},d={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd',msTransition:'MSTransitionEnd',transition:'transitionend'}[Modernizr.prefixed('transition')],f=(g,h)=>{const i=function(j){if(c.transitions){if(j.target!=this)return;this.removeEventListener(d,i)}h&&'function'==typeof h&&h.call(this)};c.transitions?g.addEventListener(d,i):i()};new GridFx(document.querySelector('.img-grid__wrap'),{imgPosition:{x:1,y:-0.75},onOpenItem(g,h){const i={width:window.innerWidth,height:window.innerHeight};g.items.forEach(j=>{if(h!=j){const k=Math.floor(130*Math.random());j.style.WebkitTransition=`opacity .5s ${k}ms cubic-bezier(.7,0,.3,1), -webkit-transform .5s ${k}ms cubic-bezier(.7,0,.3,1)`,j.style.transition=`opacity .5s ${k}ms cubic-bezier(.7,0,.3,1), transform .5s ${k}ms cubic-bezier(.7,0,.3,1)`;const l=j.getBoundingClientRect(),m={width:j.offsetWidth,height:j.offsetHeight};j.style.WebkitTransform=`translate3d(${i.width/2-l.left-m.width/2}px,${i.height-l.top-m.height/2}px,0) scale3d(0,0,1)`,j.style.transform=`translate3d(${i.width/2-l.left-m.width/2}px,${i.height-l.top-m.height/2}px,0) scale3d(0,0,1)`,j.style.opacity=0}})},onCloseItem(g,h){g.items.forEach(i=>{h!=i&&(i.style.WebkitTransition='opacity .3s, -webkit-transform .3s',i.style.transition='opacity .3s, transform .3s',i.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',i.style.transform='translate3d(0,0,0) scale3d(1,1,1)',i.style.opacity=1,f(i,()=>{i.style.transition='none',i.style.WebkitTransform='none'}))})}})})();/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
//# sourceMappingURL=image-grid-effects--babel.js.map