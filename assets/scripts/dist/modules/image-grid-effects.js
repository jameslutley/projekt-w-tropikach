/* globals window Modernizr imagesloaded *//**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */export default function imageGridEffects(){/**
   * some helper functions
   */function c(k,l){let m=!0;return n=>{m&&(m=!1,setTimeout(()=>{m=!0},l),k(n))}}function d(k){let l=k.nextSibling;for(;l&&1!==l.nodeType;)l=l.nextSibling;return l}function f(k,l){for(const m in l)l.hasOwnProperty(m)&&(k[m]=l[m]);return k}/**
   * GridFx obj
   */const g={transitions:Modernizr.csstransitions},h={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd',msTransition:'MSTransitionEnd',transition:'transitionend'}[Modernizr.prefixed('transition')],i=(k,l)=>{const m=n=>{if(g.transitions){if(n.target!==this)return;this.removeEventListener(h,m)}l&&'function'==typeof l&&l.call(this)};g.transitions?k.addEventListener(h,m):m()};// transition end event name
class j{constructor(k,l){this.gridEl=k,this.options=f({},this.options),f(this.options,l),this.items=[].slice.call(this.gridEl.querySelectorAll('.grid__item')),this.previewEl=d(this.gridEl),this.isExpanded=!1,this.isAnimating=!1,this.closeCtrl=this.previewEl.querySelector('button.action--close'),this.previewDescriptionEl=this.previewEl.querySelector('.description--preview'),this._init()}_init(){this.options.onInit(this);const k=this;// init masonry after all images are loaded
window.imagesLoaded(this.gridEl,()=>{k.gridEl.classList.add('grid--loaded'),k._initEvents(),k._setOriginal(),k._setClone()})}/**
     * initialize/bind events
     */_initEvents(){const k=this,l=null===document.ontouchstart?'touchstart':'click';this.items.forEach(m=>{const n=q=>{q.preventDefault(),k._openItem(q,m),m.removeEventListener('touchend',n)},o=()=>{m.removeEventListener('touchend',n)},p=()=>{m.addEventListener('touchend',n),m.addEventListener('touchmove',o)};m.addEventListener(l,q=>{'click'==l?(q.preventDefault(),k._openItem(q,m)):p()})}),this.closeCtrl.addEventListener('click',()=>{k._closeItem()}),window.addEventListener('resize',c(()=>{k.options.onResize(k)},10))}/**
     * open a grid item
     */_openItem(k,l){if(!(this.isAnimating||this.isExpanded)){this.isAnimating=!0,this.isExpanded=!0;// item's image
const w=l.querySelector('img'),x=w.getBoundingClientRect();// index of current item
this.current=this.items.indexOf(l),this._setOriginal(l.querySelector('a').getAttribute('href')),this.options.onOpenItem(this,l),this._setClone(w.src,{width:w.offsetWidth,height:w.offsetHeight,left:x.left,top:x.top}),l.classList.add('grid__item--current');// calculate the transform value for the clone to animate to the full image view
const y=this._getWinSize(),A=l.getAttribute('data-size').split('x'),B={width:A[0],height:A[1]},C=(0<this.options.imgPosition.x?1-Math.abs(this.options.imgPosition.x):Math.abs(this.options.imgPosition.x))*y.width+this.options.imgPosition.x*y.width/2-x.left-0.5*w.offsetWidth,D=(0<this.options.imgPosition.y?1-Math.abs(this.options.imgPosition.y):Math.abs(this.options.imgPosition.y))*y.height+this.options.imgPosition.y*y.height/2-x.top-0.5*w.offsetHeight,E=Math.min(Math.min(y.width*Math.abs(this.options.imgPosition.x)-this.options.pagemargin,B.width-this.options.pagemargin)/w.offsetWidth,Math.min(y.height*Math.abs(this.options.imgPosition.y)-this.options.pagemargin,B.height-this.options.pagemargin)/w.offsetHeight);// apply transform to the clone
this.cloneImg.style.WebkitTransform=`translate3d(${C}px, ${D}px, 0) scale3d(${E}, ${E}, 1)`,this.cloneImg.style.transform=`translate3d(${C}px, ${D}px, 0) scale3d(${E}, ${E}, 1)`;// add the description if any
const F=l.querySelector('.description');F&&(this.previewDescriptionEl.innerHTML=F.innerHTML);const G=this;setTimeout(()=>{G.previewEl.classList.add('preview--open'),G.options.onExpand()},0),i(this.cloneImg,()=>{window.imagesLoaded(G.originalImg,()=>{G.previewEl.classList.add('preview--image-loaded'),G.originalImg.style.opacity=1,i(G.originalImg,()=>{G.cloneImg.style.opacity=0,G.cloneImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',G.cloneImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',G.isAnimating=!1})})})}// set the src of the original image element (large image)
// callback
// set the clone image
// hide original grid item
// after the clone animates..
}/**
     * create/set the original/large image element
     */_setOriginal(k){k||(this.originalImg=document.createElement('img'),this.originalImg.className='original',this.originalImg.style.opacity=0,this.originalImg.style.maxWidth=`calc(${parseInt(100*Math.abs(this.options.imgPosition.x))}vw - ${this.options.pagemargin}px)`,this.originalImg.style.maxHeight=`calc(${parseInt(100*Math.abs(this.options.imgPosition.y))}vh - ${this.options.pagemargin}px)`,this.originalImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',this.originalImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',k='',this.previewEl.appendChild(this.originalImg)),this.originalImg.setAttribute('src',k)}/**
     * create/set the clone image element
     */_setClone(k,l){k?(this.cloneImg.style.opacity=1,this.cloneImg.style.width=`${l.width}px`,this.cloneImg.style.height=`${l.height}px`,this.cloneImg.style.top=`${l.top}px`,this.cloneImg.style.left=`${l.left}px`):(this.cloneImg=document.createElement('img'),this.cloneImg.className='clone',k='',this.cloneImg.style.opacity=0,this.previewEl.appendChild(this.cloneImg)),this.cloneImg.setAttribute('src',k)}/**
     * closes the original/large image view
     */_closeItem(){if(this.isExpanded&&!this.isAnimating){this.isExpanded=!1,this.isAnimating=!0;// the grid item's image and its offset
const w=this.items[this.current],x=w.querySelector('img'),y=x.getBoundingClientRect(),A=this;this.previewEl.classList.remove('preview--open'),this.previewEl.classList.remove('preview--image-loaded'),this.options.onCloseItem(this,w),this.originalImg.classList.add('animate');// set the transform to the original/large image
const B=this._getWinSize(),C=y.left+x.offsetWidth/2-((0<this.options.imgPosition.x?1-Math.abs(this.options.imgPosition.x):Math.abs(this.options.imgPosition.x))*B.width+this.options.imgPosition.x*B.width/2),D=y.top+x.offsetHeight/2-((0<this.options.imgPosition.y?1-Math.abs(this.options.imgPosition.y):Math.abs(this.options.imgPosition.y))*B.height+this.options.imgPosition.y*B.height/2),E=x.offsetWidth/this.originalImg.offsetWidth;this.originalImg.style.WebkitTransform=`translate3d(${C}px, ${D}px, 0) scale3d(${E}, ${E}, 1)`,this.originalImg.style.transform=`translate3d(${C}px, ${D}px, 0) scale3d(${E}, ${E}, 1)`,i(this.originalImg,()=>{A.previewDescriptionEl.innerHTML='',w.classList.remove('grid__item--current'),setTimeout(()=>{A.originalImg.style.opacity=0},60),i(A.originalImg,()=>{A.originalImg.classList.remove('animate'),A.originalImg.style.WebkitTransform='translate3d(0,0,0) scale3d(1,1,1)',A.originalImg.style.transform='translate3d(0,0,0) scale3d(1,1,1)',A.isAnimating=!1})})}// callback
// large image will animate back to the position of its grid's item
// once that's done..
}/**
     * gets the window sizes
     */_getWinSize(){return{width:document.documentElement.clientWidth,height:window.innerHeight}}}/**
   * options
   */j.prototype.options={pagemargin:0,// x and y can have values from 0 to 1 (percentage). If negative then
// it means the alignment is left and/or top rather than right and/or bottom
// so, as an example, if we want our large image to be positioned vertically on 25%
// of the screen and centered horizontally the values would be x:1,y:-0.25
imgPosition:{x:1,y:1},onInit(){return!1},onResize(){return!1},onOpenItem(){return!1},onCloseItem(){return!1},onExpand(){return!1}},window.GridFx=j}
//# sourceMappingURL=image-grid-effects.js.map