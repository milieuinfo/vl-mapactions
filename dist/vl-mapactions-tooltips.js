parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nMeT":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={POSTRENDER:"postrender",MOVESTART:"movestart",MOVEEND:"moveend"};exports.default=e;
},{}],"gvrh":[function(require,module,exports) {
"use strict";function t(){return function(){throw new Error("Unimplemented abstract method.")}()}Object.defineProperty(exports,"__esModule",{value:!0}),exports.abstract=t,exports.getUid=r,exports.VERSION=void 0;let e=0;function r(t){return t.ol_uid||(t.ol_uid=String(++e))}const o="latest";exports.VERSION=o;
},{}],"ptNe":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={PROPERTYCHANGE:"propertychange"};exports.default=e;
},{}],"c6bJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.clear=e,exports.isEmpty=o,exports.getValues=exports.assign=void 0;const t="function"==typeof Object.assign?Object.assign:function(t,e){if(null==t)throw new TypeError("Cannot convert undefined or null to object");const n=Object(t);for(let o=1,s=arguments.length;o<s;++o){const t=arguments[o];if(null!=t)for(const e in t)t.hasOwnProperty(e)&&(n[e]=t[e])}return n};function e(t){for(const e in t)delete t[e]}exports.assign=t;const n="function"==typeof Object.values?Object.values:function(t){const e=[];for(const n in t)e.push(t[n]);return e};function o(t){let e;for(e in t)return!1;return!e}exports.getValues=n;
},{}],"TEtv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.listen=t,exports.listenOnce=n,exports.unlistenByKey=r;var e=require("./obj.js");function t(e,t,n,r,o){if(r&&r!==e&&(n=n.bind(r)),o){const r=n;n=function(){e.removeEventListener(t,n),r.apply(this,arguments)}}const s={target:e,type:t,listener:n};return e.addEventListener(t,n),s}function n(e,n,r,o){return t(e,n,r,o,!0)}function r(t){console.log(t),t&&t.target&&(console.log(t.target),t.target.removeEventListener(t.type,t.listener),(0,e.clear)(t))}
},{"./obj.js":"c6bJ"}],"g7g6":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;class s{constructor(){this.disposed_=!1}dispose(){this.disposed_||(this.disposed_=!0,this.disposeInternal())}disposeInternal(){}}var e=s;exports.default=e;
},{}],"uHwP":[function(require,module,exports) {
"use strict";function e(e,n,t){let o,u;const i=t||r;let f=0,s=e.length,l=!1;for(;f<s;)(u=+i(e[o=f+(s-f>>1)],n))<0?f=o+1:(s=o,l=!u);return l?f:~f}function r(e,r){return e>r?1:e<r?-1:0}function n(e,r){return e.indexOf(r)>=0}function t(e,r,n){const t=e.length;if(e[0]<=r)return 0;if(r<=e[t-1])return t-1;{let o;if(n>0){for(o=1;o<t;++o)if(e[o]<r)return o-1}else if(n<0){for(o=1;o<t;++o)if(e[o]<=r)return o}else for(o=1;o<t;++o){if(e[o]==r)return o;if(e[o]<r)return e[o-1]-r<r-e[o]?o-1:o}return t-1}}function o(e,r,n){for(;r<n;){const t=e[r];e[r]=e[n],e[n]=t,++r,--n}}function u(e,r){const n=Array.isArray(r)?r:[r],t=n.length;for(let o=0;o<t;o++)e[e.length]=n[o]}function i(e,r){const n=e.indexOf(r),t=n>-1;return t&&e.splice(n,1),t}function f(e,r){const n=e.length>>>0;let t;for(let o=0;o<n;o++)if(r(t=e[o],o,e))return t;return null}function s(e,r){const n=e.length;if(n!==r.length)return!1;for(let t=0;t<n;t++)if(e[t]!==r[t])return!1;return!0}function l(e,r){const n=e.length,t=Array(e.length);let o;for(o=0;o<n;o++)t[o]={index:o,value:e[o]};for(t.sort(function(e,n){return r(e.value,n.value)||e.index-n.index}),o=0;o<e.length;o++)e[o]=t[o].value}function c(e,r){let n;return!e.every(function(t,o){return n=o,!r(t,o,e)})?n:-1}function x(e,n,t){const o=n||r;return e.every(function(r,n){if(0===n)return!0;const u=o(e[n-1],r);return!(u>0||t&&0===u)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.binarySearch=e,exports.numberSafeCompareFunction=r,exports.includes=n,exports.linearFindNearest=t,exports.reverseSubArray=o,exports.extend=u,exports.remove=i,exports.find=f,exports.equals=s,exports.stableSort=l,exports.findIndex=c,exports.isSorted=x;
},{}],"mKAY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TRUE=t,exports.FALSE=r,exports.VOID=n,exports.memoizeOne=o;var e=require("./array.js");function t(){return!0}function r(){return!1}function n(){}function o(t){let r,n,o,s=!1;return function(){const u=Array.prototype.slice.call(arguments);return s&&this===o&&(0,e.equals)(u,n)||(s=!0,o=this,n=u,r=t.apply(this,arguments)),r}}
},{"./array.js":"uHwP"}],"rYf1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.stopPropagation=o,exports.preventDefault=e,exports.default=void 0;class t{constructor(t){this.propagationStopped,this.type=t,this.target=null}preventDefault(){this.propagationStopped=!0}stopPropagation(){this.propagationStopped=!0}}function o(t){t.stopPropagation()}function e(t){t.preventDefault()}var p=t;exports.default=p;
},{}],"VT2J":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("../Disposable.js")),t=require("../functions.js"),s=n(require("./Event.js")),i=require("../obj.js");function n(e){return e&&e.__esModule?e:{default:e}}class r extends e.default{constructor(e){super(),this.eventTarget_=e,this.pendingRemovals_={},this.dispatching_={},this.listeners_={}}addEventListener(e,t){if(!e||!t)return;let s=this.listeners_[e];s||(s=[],this.listeners_[e]=s),-1===s.indexOf(t)&&s.push(t)}dispatchEvent(e){const i="string"==typeof e?new s.default(e):e,n=i.type;i.target||(i.target=this.eventTarget_||this);const r=this.listeners_[n];let h;if(r){n in this.dispatching_||(this.dispatching_[n]=0,this.pendingRemovals_[n]=0),++this.dispatching_[n];for(let e=0,t=r.length;e<t;++e)if(!1===(h="handleEvent"in r[e]?r[e].handleEvent(i):r[e].call(this,i))||i.propagationStopped){h=!1;break}if(--this.dispatching_[n],0===this.dispatching_[n]){let e=this.pendingRemovals_[n];for(delete this.pendingRemovals_[n];e--;)this.removeEventListener(n,t.VOID);delete this.dispatching_[n]}return h}}disposeInternal(){(0,i.clear)(this.listeners_)}getListeners(e){return this.listeners_[e]}hasListener(e){return e?e in this.listeners_:Object.keys(this.listeners_).length>0}removeEventListener(e,s){const i=this.listeners_[e];if(i){const n=i.indexOf(s);-1!==n&&(e in this.pendingRemovals_?(i[n]=t.VOID,++this.pendingRemovals_[e]):(i.splice(n,1),0===i.length&&delete this.listeners_[e]))}}}var h=r;exports.default=h;
},{"../Disposable.js":"g7g6","../functions.js":"mKAY","./Event.js":"rYf1","../obj.js":"c6bJ"}],"Ak1Z":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={CHANGE:"change",ERROR:"error",BLUR:"blur",CLEAR:"clear",CONTEXTMENU:"contextmenu",CLICK:"click",DBLCLICK:"dblclick",DRAGENTER:"dragenter",DRAGOVER:"dragover",DROP:"drop",FOCUS:"focus",KEYDOWN:"keydown",KEYPRESS:"keypress",LOAD:"load",RESIZE:"resize",TOUCHMOVE:"touchmove",WHEEL:"wheel"};exports.default=e;
},{}],"VYsY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.unByKey=i,exports.default=void 0;var e=require("./events.js"),r=s(require("./events/Target.js")),t=s(require("./events/EventType.js"));function s(e){return e&&e.__esModule?e:{default:e}}class n extends r.default{constructor(){super(),this.revision_=0}changed(){++this.revision_,this.dispatchEvent(t.default.CHANGE)}getRevision(){return this.revision_}on(r,t){if(Array.isArray(r)){const s=r.length,n=new Array(s);for(let i=0;i<s;++i)n[i]=(0,e.listen)(this,r[i],t);return n}return(0,e.listen)(this,r,t)}once(r,t){if(Array.isArray(r)){const s=r.length,n=new Array(s);for(let i=0;i<s;++i)n[i]=(0,e.listenOnce)(this,r[i],t);return n}return(0,e.listenOnce)(this,r,t)}un(e,r){if(Array.isArray(e))for(let t=0,s=e.length;t<s;++t)this.removeEventListener(e[t],r);else this.removeEventListener(e,r)}}function i(r){if(Array.isArray(r))for(let t=0,s=r.length;t<s;++t)(0,e.unlistenByKey)(r[t]);else(0,e.unlistenByKey)(r)}var o=n;exports.default=o;
},{"./events.js":"TEtv","./events/Target.js":"VT2J","./events/EventType.js":"Ak1Z"}],"X18S":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getChangeEventType=l,exports.default=exports.ObjectEvent=void 0;var e=require("./util.js"),t=u(require("./ObjectEventType.js")),s=u(require("./Observable.js")),r=u(require("./events/Event.js")),i=require("./obj.js");function u(e){return e&&e.__esModule?e:{default:e}}class n extends r.default{constructor(e,t,s){super(e),this.key=t,this.oldValue=s}}exports.ObjectEvent=n;class o extends s.default{constructor(t){super(),(0,e.getUid)(this),this.values_={},void 0!==t&&this.setProperties(t)}get(e){let t;return this.values_.hasOwnProperty(e)&&(t=this.values_[e]),t}getKeys(){return Object.keys(this.values_)}getProperties(){return(0,i.assign)({},this.values_)}notify(e,s){let r;r=l(e),this.dispatchEvent(new n(r,e,s)),r=t.default.PROPERTYCHANGE,this.dispatchEvent(new n(r,e,s))}set(e,t,s){if(s)this.values_[e]=t;else{const s=this.values_[e];this.values_[e]=t,s!==t&&this.notify(e,s)}}setProperties(e,t){for(const s in e)this.set(s,e[s],t)}unset(e,t){if(e in this.values_){const s=this.values_[e];delete this.values_[e],t||this.notify(e,s)}}}const a={};function l(e){return a.hasOwnProperty(e)?a[e]:a[e]="change:"+e}var h=o;exports.default=h;
},{"./util.js":"gvrh","./ObjectEventType.js":"ptNe","./Observable.js":"VYsY","./events/Event.js":"rYf1","./obj.js":"c6bJ"}],"av2E":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t={BOTTOM_LEFT:"bottom-left",BOTTOM_CENTER:"bottom-center",BOTTOM_RIGHT:"bottom-right",CENTER_LEFT:"center-left",CENTER_CENTER:"center-center",CENTER_RIGHT:"center-right",TOP_LEFT:"top-left",TOP_CENTER:"top-center",TOP_RIGHT:"top-right"};exports.default=t;
},{}],"omMx":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getFontParameters=exports.CLASS_COLLAPSED=exports.CLASS_CONTROL=exports.CLASS_UNSUPPORTED=exports.CLASS_UNSELECTABLE=exports.CLASS_SELECTABLE=exports.CLASS_HIDDEN=void 0;const e="ol-hidden";exports.CLASS_HIDDEN="ol-hidden";const o="ol-selectable";exports.CLASS_SELECTABLE="ol-selectable";const t="ol-unselectable";exports.CLASS_UNSELECTABLE="ol-unselectable";const s="ol-unsupported";exports.CLASS_UNSUPPORTED="ol-unsupported";const l="ol-control";exports.CLASS_CONTROL="ol-control";const r="ol-collapsed";exports.CLASS_COLLAPSED="ol-collapsed";const n=new RegExp(["^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)","(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)","(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)","(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?","(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))","(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))","?\\s*([-,\\\"\\'\\sa-z]+?)\\s*$"].join(""),"i"),a=["style","variant","weight","size","lineHeight","family"],i=function(e){const o=e.match(n);if(!o)return null;const t={lineHeight:"normal",size:"1.2em",style:"normal",weight:"normal",variant:"normal"};for(let s=0,l=a.length;s<l;++s){const e=o[s+1];void 0!==e&&(t[a[s]]=e)}return t.families=t.family.split(/,\s?/),t};exports.getFontParameters=i;
},{}],"E1VY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PASSIVE_EVENT_LISTENERS=exports.IMAGE_DECODE=exports.WORKER_OFFSCREEN_CANVAS=exports.DEVICE_PIXEL_RATIO=exports.MAC=exports.WEBKIT=exports.SAFARI=exports.FIREFOX=void 0;const e="undefined"!=typeof navigator?navigator.userAgent.toLowerCase():"",o=-1!==e.indexOf("firefox");exports.FIREFOX=o;const t=-1!==e.indexOf("safari")&&-1==e.indexOf("chrom");exports.SAFARI=t;const n=-1!==e.indexOf("webkit")&&-1==e.indexOf("edge");exports.WEBKIT=n;const r=-1!==e.indexOf("macintosh");exports.MAC=r;const s="undefined"!=typeof devicePixelRatio?devicePixelRatio:1;exports.DEVICE_PIXEL_RATIO=s;const i="undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof OffscreenCanvas&&self instanceof WorkerGlobalScope;exports.WORKER_OFFSCREEN_CANVAS=i;const E="undefined"!=typeof Image&&Image.prototype.decode;exports.IMAGE_DECODE=E;const d=function(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("_",null,t),window.removeEventListener("_",null,t)}catch(o){}return e}();exports.PASSIVE_EVENT_LISTENERS=d;
},{}],"MHGO":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createCanvasContext2D=t,exports.outerWidth=r,exports.outerHeight=n,exports.replaceNode=o,exports.removeNode=i,exports.removeChildren=s,exports.replaceChildren=a;var e=require("./has.js");function t(t,r,n){const o=n&&n.length?n.shift():e.WORKER_OFFSCREEN_CANVAS?new OffscreenCanvas(t||300,r||300):document.createElement("canvas");return t&&(o.width=t),r&&(o.height=r),o.getContext("2d")}function r(e){let t=e.offsetWidth;const r=getComputedStyle(e);return t+=parseInt(r.marginLeft,10)+parseInt(r.marginRight,10)}function n(e){let t=e.offsetHeight;const r=getComputedStyle(e);return t+=parseInt(r.marginTop,10)+parseInt(r.marginBottom,10)}function o(e,t){const r=t.parentNode;r&&r.replaceChild(e,t)}function i(e){return e&&e.parentNode?e.parentNode.removeChild(e):null}function s(e){for(;e.lastChild;)e.removeChild(e.lastChild)}function a(e,t){const r=e.childNodes;for(let n=0;;++n){const o=r[n],i=t[n];if(!o&&!i)break;o!==i&&(o?i?e.insertBefore(i,o):(e.removeChild(o),--n):e.appendChild(i))}}
},{"./has.js":"E1VY"}],"ixPR":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("./util.js");class s extends Error{constructor(s){const r="Assertion failed. See https://openlayers.org/en/"+("latest"===e.VERSION?e.VERSION:"v"+e.VERSION.split("-")[0])+"/doc/errors/#"+s+" for details.";super(r),this.code=s,this.name="AssertionError",this.message=r}}var r=s;exports.default=r;
},{"./util.js":"gvrh"}],"kWiW":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.assert=t;var e=r(require("./AssertionError.js"));function r(e){return e&&e.__esModule?e:{default:e}}function t(r,t){if(!r)throw new e.default(t)}
},{"./AssertionError.js":"ixPR"}],"An1B":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t={BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",TOP_LEFT:"top-left",TOP_RIGHT:"top-right"};exports.default=t;
},{}],"sf50":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={UNKNOWN:0,INTERSECTING:1,ABOVE:2,RIGHT:4,BELOW:8,LEFT:16};exports.default=e;
},{}],"E4kN":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.boundingExtent=o,exports.buffer=a,exports.clone=s,exports.closestSquaredDistanceXY=i,exports.containsCoordinate=f,exports.containsExtent=c,exports.containsXY=p,exports.coordinateRelationship=l,exports.createEmpty=x,exports.createOrUpdate=d,exports.createOrUpdateEmpty=h,exports.createOrUpdateFromCoordinate=g,exports.createOrUpdateFromCoordinates=m,exports.createOrUpdateFromFlatCoordinates=M,exports.createOrUpdateFromRings=E,exports.equals=T,exports.approximatelyEquals=O,exports.extend=C,exports.extendCoordinate=R,exports.extendCoordinates=F,exports.extendFlatCoordinates=I,exports.extendRings=N,exports.extendXY=y,exports.forEachCorner=B,exports.getArea=L,exports.getBottomLeft=U,exports.getBottomRight=G,exports.getCenter=_,exports.getCorner=b,exports.getEnlargedArea=A,exports.getForViewAndSize=S,exports.getHeight=W,exports.getIntersectionArea=q,exports.getIntersection=H,exports.getMargin=X,exports.getSize=j,exports.getTopLeft=V,exports.getTopRight=P,exports.getWidth=Y,exports.intersects=v,exports.isEmpty=w,exports.returnOrUpdate=z,exports.scaleFromCenter=K,exports.intersectsSegment=D,exports.applyTransform=k,exports.wrapX=J;var t=require("./asserts.js"),e=r(require("./extent/Corner.js")),n=r(require("./extent/Relationship.js"));function r(t){return t&&t.__esModule?t:{default:t}}function o(t){const e=x();for(let n=0,r=t.length;n<r;++n)R(e,t[n]);return e}function u(t,e,n){return d(Math.min.apply(null,t),Math.min.apply(null,e),Math.max.apply(null,t),Math.max.apply(null,e),n)}function a(t,e,n){return n?(n[0]=t[0]-e,n[1]=t[1]-e,n[2]=t[2]+e,n[3]=t[3]+e,n):[t[0]-e,t[1]-e,t[2]+e,t[3]+e]}function s(t,e){return e?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e):t.slice()}function i(t,e,n){let r,o;return(r=e<t[0]?t[0]-e:t[2]<e?e-t[2]:0)*r+(o=n<t[1]?t[1]-n:t[3]<n?n-t[3]:0)*o}function f(t,e){return p(t,e[0],e[1])}function c(t,e){return t[0]<=e[0]&&e[2]<=t[2]&&t[1]<=e[1]&&e[3]<=t[3]}function p(t,e,n){return t[0]<=e&&e<=t[2]&&t[1]<=n&&n<=t[3]}function l(t,e){const r=t[0],o=t[1],u=t[2],a=t[3],s=e[0],i=e[1];let f=n.default.UNKNOWN;return s<r?f|=n.default.LEFT:s>u&&(f|=n.default.RIGHT),i<o?f|=n.default.BELOW:i>a&&(f|=n.default.ABOVE),f===n.default.UNKNOWN&&(f=n.default.INTERSECTING),f}function x(){return[1/0,1/0,-1/0,-1/0]}function d(t,e,n,r,o){return o?(o[0]=t,o[1]=e,o[2]=n,o[3]=r,o):[t,e,n,r]}function h(t){return d(1/0,1/0,-1/0,-1/0,t)}function g(t,e){const n=t[0],r=t[1];return d(n,r,n,r,e)}function m(t,e){return F(h(e),t)}function M(t,e,n,r,o){return I(h(o),t,e,n,r)}function E(t,e){return N(h(e),t)}function T(t,e){return t[0]==e[0]&&t[2]==e[2]&&t[1]==e[1]&&t[3]==e[3]}function O(t,e,n){return Math.abs(t[0]-e[0])<n&&Math.abs(t[2]-e[2])<n&&Math.abs(t[1]-e[1])<n&&Math.abs(t[3]-e[3])<n}function C(t,e){return e[0]<t[0]&&(t[0]=e[0]),e[2]>t[2]&&(t[2]=e[2]),e[1]<t[1]&&(t[1]=e[1]),e[3]>t[3]&&(t[3]=e[3]),t}function R(t,e){e[0]<t[0]&&(t[0]=e[0]),e[0]>t[2]&&(t[2]=e[0]),e[1]<t[1]&&(t[1]=e[1]),e[1]>t[3]&&(t[3]=e[1])}function F(t,e){for(let n=0,r=e.length;n<r;++n)R(t,e[n]);return t}function I(t,e,n,r,o){for(;n<r;n+=o)y(t,e[n],e[n+1]);return t}function N(t,e){for(let n=0,r=e.length;n<r;++n)F(t,e[n]);return t}function y(t,e,n){t[0]=Math.min(t[0],e),t[1]=Math.min(t[1],n),t[2]=Math.max(t[2],e),t[3]=Math.max(t[3],n)}function B(t,e){let n;return(n=e(U(t)))?n:(n=e(G(t)))?n:(n=e(P(t)))?n:(n=e(V(t)))||!1}function L(t){let e=0;return w(t)||(e=Y(t)*W(t)),e}function U(t){return[t[0],t[1]]}function G(t){return[t[2],t[1]]}function _(t){return[(t[0]+t[2])/2,(t[1]+t[3])/2]}function b(n,r){let o;return r===e.default.BOTTOM_LEFT?o=U(n):r===e.default.BOTTOM_RIGHT?o=G(n):r===e.default.TOP_LEFT?o=V(n):r===e.default.TOP_RIGHT?o=P(n):(0,t.assert)(!1,13),o}function A(t,e){const n=Math.min(t[0],e[0]),r=Math.min(t[1],e[1]);return(Math.max(t[2],e[2])-n)*(Math.max(t[3],e[3])-r)}function S(t,e,n,r,o){const u=e*r[0]/2,a=e*r[1]/2,s=Math.cos(n),i=Math.sin(n),f=u*s,c=u*i,p=a*s,l=a*i,x=t[0],h=t[1],g=x-f+l,m=x-f-l,M=x+f-l,E=x+f+l,T=h-c-p,O=h-c+p,C=h+c+p,R=h+c-p;return d(Math.min(g,m,M,E),Math.min(T,O,C,R),Math.max(g,m,M,E),Math.max(T,O,C,R),o)}function W(t){return t[3]-t[1]}function q(t,e){return L(H(t,e))}function H(t,e,n){const r=n||x();return v(t,e)?(t[0]>e[0]?r[0]=t[0]:r[0]=e[0],t[1]>e[1]?r[1]=t[1]:r[1]=e[1],t[2]<e[2]?r[2]=t[2]:r[2]=e[2],t[3]<e[3]?r[3]=t[3]:r[3]=e[3]):h(r),r}function X(t){return Y(t)+W(t)}function j(t){return[t[2]-t[0],t[3]-t[1]]}function V(t){return[t[0],t[3]]}function P(t){return[t[2],t[3]]}function Y(t){return t[2]-t[0]}function v(t,e){return t[0]<=e[2]&&t[2]>=e[0]&&t[1]<=e[3]&&t[3]>=e[1]}function w(t){return t[2]<t[0]||t[3]<t[1]}function z(t,e){return e?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e):t}function K(t,e){const n=(t[2]-t[0])/2*(e-1),r=(t[3]-t[1])/2*(e-1);t[0]-=n,t[2]+=n,t[1]-=r,t[3]+=r}function D(t,e,r){let o=!1;const u=l(t,e),a=l(t,r);if(u===n.default.INTERSECTING||a===n.default.INTERSECTING)o=!0;else{const s=t[0],i=t[1],f=t[2],c=t[3],p=e[0],l=e[1],x=r[0],d=r[1],h=(d-l)/(x-p);let g,m;a&n.default.ABOVE&&!(u&n.default.ABOVE)&&(o=(g=x-(d-c)/h)>=s&&g<=f),o||!(a&n.default.RIGHT)||u&n.default.RIGHT||(o=(m=d-(x-f)*h)>=i&&m<=c),o||!(a&n.default.BELOW)||u&n.default.BELOW||(o=(g=x-(d-i)/h)>=s&&g<=f),o||!(a&n.default.LEFT)||u&n.default.LEFT||(o=(m=d-(x-s)*h)>=i&&m<=c)}return o}function k(t,e,n,r){let o=[];if(r>1){const e=t[2]-t[0],n=t[3]-t[1];for(let u=0;u<r;++u)o.push(t[0]+e*u/r,t[1],t[2],t[1]+n*u/r,t[2]-e*u/r,t[3],t[0],t[3]-n*u/r)}else o=[t[0],t[1],t[2],t[1],t[2],t[3],t[0],t[3]];e(o,o,2);const a=[],s=[];for(let u=0,i=o.length;u<i;u+=2)a.push(o[u]),s.push(o[u+1]);return u(a,s,n)}function J(t,e){const n=e.getExtent(),r=_(t);if(e.canWrapX()&&(r[0]<n[0]||r[0]>=n[2])){const e=Y(n),o=Math.floor((r[0]-n[0])/e)*e;t[0]-=o,t[2]-=o}return t}
},{"./asserts.js":"kWiW","./extent/Corner.js":"An1B","./extent/Relationship.js":"sf50"}],"kpPG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=h(require("./MapEventType.js")),t=d(require("./Object.js")),i=h(require("./OverlayPositioning.js")),n=require("./css.js"),s=require("./dom.js"),o=require("./events.js"),r=require("./extent.js");function a(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return a=function(){return e},e}function d(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=a();if(t&&t.has(e))return t.get(e);var i={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if(Object.prototype.hasOwnProperty.call(e,s)){var o=n?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(i,s,o):i[s]=e[s]}return i.default=e,t&&t.set(e,i),i}function h(e){return e&&e.__esModule?e:{default:e}}const l={ELEMENT:"element",MAP:"map",OFFSET:"offset",POSITION:"position",POSITIONING:"positioning"};class u extends t.default{constructor(e){super(),this.options=e,this.id=e.id,this.insertFirst=void 0===e.insertFirst||e.insertFirst,this.stopEvent=void 0===e.stopEvent||e.stopEvent,this.element=document.createElement("div"),this.element.className=void 0!==e.className?e.className:"ol-overlay-container "+n.CLASS_SELECTABLE,this.element.style.position="absolute";let s=e.autoPan;s&&"object"!=typeof s&&(s={animation:e.autoPanAnimation,margin:e.autoPanMargin}),this.autoPan=s||!1,this.rendered={transform_:"",visible:!0},this.mapPostrenderListenerKey=null,this.addEventListener((0,t.getChangeEventType)(l.ELEMENT),this.handleElementChanged),this.addEventListener((0,t.getChangeEventType)(l.MAP),this.handleMapChanged),this.addEventListener((0,t.getChangeEventType)(l.OFFSET),this.handleOffsetChanged),this.addEventListener((0,t.getChangeEventType)(l.POSITION),this.handlePositionChanged),this.addEventListener((0,t.getChangeEventType)(l.POSITIONING),this.handlePositioningChanged),void 0!==e.element&&this.setElement(e.element),this.setOffset(void 0!==e.offset?e.offset:[0,0]),this.setPositioning(void 0!==e.positioning?e.positioning:i.default.TOP_LEFT),void 0!==e.position&&this.setPosition(e.position)}getElement(){return this.get(l.ELEMENT)}getId(){return this.id}getMap(){return this.get(l.MAP)}getOffset(){return this.get(l.OFFSET)}getPosition(){return this.get(l.POSITION)}getPositioning(){return this.get(l.POSITIONING)}handleElementChanged(){(0,s.removeChildren)(this.element);const e=this.getElement();e&&this.element.appendChild(e)}handleMapChanged(){this.mapPostrenderListenerKey&&((0,s.removeNode)(this.element),(0,o.unlistenByKey)(this.mapPostrenderListenerKey),this.mapPostrenderListenerKey=null);const t=this.getMap();if(t){this.mapPostrenderListenerKey=(0,o.listen)(t,e.default.POSTRENDER,this.render,this),this.updatePixelPosition();const i=this.stopEvent?t.getOverlayContainerStopEvent():t.getOverlayContainer();this.insertFirst?i.insertBefore(this.element,i.childNodes[0]||null):i.appendChild(this.element),this.performAutoPan()}}render(){this.updatePixelPosition()}handleOffsetChanged(){this.updatePixelPosition()}handlePositionChanged(){this.updatePixelPosition(),this.performAutoPan()}handlePositioningChanged(){this.updatePixelPosition()}setElement(e){this.set(l.ELEMENT,e)}setMap(e){this.set(l.MAP,e)}setOffset(e){this.set(l.OFFSET,e)}setPosition(e){this.set(l.POSITION,e)}performAutoPan(){this.autoPan&&this.panIntoView(this.autoPan)}panIntoView(e){const t=this.getMap();if(!t||!t.getTargetElement()||!this.get(l.POSITION))return;const i=this.getRect(t.getTargetElement(),t.getSize()),n=this.getElement(),o=this.getRect(n,[(0,s.outerWidth)(n),(0,s.outerHeight)(n)]),a=void 0===e.margin?20:e.margin;if(!(0,r.containsExtent)(i,o)){const n=o[0]-i[0],s=i[2]-o[2],r=o[1]-i[1],d=i[3]-o[3],h=[0,0];if(n<0?h[0]=n-a:s<0&&(h[0]=Math.abs(s)+a),r<0?h[1]=r-a:d<0&&(h[1]=Math.abs(d)+a),0!==h[0]||0!==h[1]){const i=t.getView().getCenterInternal(),n=t.getPixelFromCoordinateInternal(i),s=[n[0]+h[0],n[1]+h[1]],o=e.animation||{};t.getView().animateInternal({center:t.getCoordinateFromPixelInternal(s),duration:o.duration,easing:o.easing})}}}getRect(e,t){const i=e.getBoundingClientRect(),n=i.left+window.pageXOffset,s=i.top+window.pageYOffset;return[n,s,n+t[0],s+t[1]]}setPositioning(e){this.set(l.POSITIONING,e)}setVisible(e){this.rendered.visible!==e&&(this.element.style.display=e?"":"none",this.rendered.visible=e)}updatePixelPosition(){const e=this.getMap(),t=this.getPosition();if(!e||!e.isRendered()||!t)return void this.setVisible(!1);const i=e.getPixelFromCoordinate(t),n=e.getSize();this.updateRenderedPosition(i,n)}updateRenderedPosition(e,t){const n=this.element.style,s=this.getOffset(),o=this.getPositioning();this.setVisible(!0);const r=Math.round(e[0]+s[0])+"px",a=Math.round(e[1]+s[1])+"px";let d="0%",h="0%";o==i.default.BOTTOM_RIGHT||o==i.default.CENTER_RIGHT||o==i.default.TOP_RIGHT?d="-100%":o!=i.default.BOTTOM_CENTER&&o!=i.default.CENTER_CENTER&&o!=i.default.TOP_CENTER||(d="-50%"),o==i.default.BOTTOM_LEFT||o==i.default.BOTTOM_CENTER||o==i.default.BOTTOM_RIGHT?h="-100%":o!=i.default.CENTER_LEFT&&o!=i.default.CENTER_CENTER&&o!=i.default.CENTER_RIGHT||(h="-50%");const l=`translate(${d}, ${h}) translate(${r}, ${a})`;this.rendered.transform_!=l&&(this.rendered.transform_=l,n.transform=l,n.msTransform=l)}getOptions(){return this.options}}var g=u;exports.default=g;
},{"./MapEventType.js":"nMeT","./Object.js":"X18S","./OverlayPositioning.js":"av2E","./css.js":"omMx","./dom.js":"MHGO","./events.js":"TEtv","./extent.js":"E4kN"}],"slT2":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Tooltips=void 0;var t=e(require("ol/src/ol/Overlay"));function e(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var n=function e(n,i,s,r){var a=this;o(this,e),this.layer=n,n.tooltips=[],this.showTooltip=function(e,o,a,l){l=l||{};var c=document.createElement("div");c.innerHTML="<span class='content'></span><div class='arrow'></div>",c.setAttribute("class","info-tooltip");var u=new t.default({offset:l.offset||[0,-10],positioning:"bottom-center",insertFirst:!1});function f(t){c.childNodes[0].innerHTML=t,u.setPosition(a),u.setElement(c),c.parentNode.style.position="fixed"}u.setElement(c),e.addOverlay(u),n.tooltips.push(u);var p=0,d=setTimeout(function(){p=500,f("<span class='icon'></span> "+(s||"Info berekenen  ..."))},100);i(o,a).then(function(t){setTimeout(function(){clearTimeout(d),f(t),e.render(),r&&r(o,a)},p)})},this.clear=function(t){a.layer.tooltips.forEach(function(e){t.removeOverlay(e)})}};exports.Tooltips=n;
},{"ol/src/ol/Overlay":"kpPG"}]},{},["slT2"], null)
//# sourceMappingURL=/vl-mapactions-tooltips.js.map