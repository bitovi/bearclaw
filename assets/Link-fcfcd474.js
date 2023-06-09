import{j as w}from"./jsx-runtime-ad672792.js";import{r as s}from"./index-f1f749bf.js";import{p as H,j as g,L as F,m as M,u as T,D as U,k as O,N as $}from"./index-e50b599f.js";import{_ as A}from"./iframe-38d805be.js";/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function d(){return d=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},d.apply(this,arguments)}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function L(e,r){if(e===!1||e===null||typeof e>"u")throw new Error(r)}async function I(e,r){if(e.id in r)return r[e.id];try{let t=await A(()=>import(e.module),[],import.meta.url);return r[e.id]=t,t}catch{return window.location.reload(),new Promise(()=>{})}}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function z(e){return e==null?!1:e.href==null?e.rel==="preload"&&(typeof e.imageSrcSet=="string"||typeof e.imagesrcset=="string")&&(typeof e.imageSizes=="string"||typeof e.imagesizes=="string"):typeof e.rel=="string"&&typeof e.href=="string"}async function B(e,r,t){return(await Promise.all(e.map(async n=>{let l=await I(r.routes[n.route.id],t);return l.links?l.links():[]}))).flat(1).filter(z).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="preload"?{...n,rel:"prefetch"}:{...n,rel:"prefetch",as:"style"})}function k(e,r,t,a,n,l){let f=v(e),u=(i,o)=>t[o]?i.route.id!==t[o].route.id:!0,c=(i,o)=>{var m;return t[o].pathname!==i.pathname||((m=t[o].route.path)===null||m===void 0?void 0:m.endsWith("*"))&&t[o].params["*"]!==i.params["*"]};return l==="data"&&n.search!==f.search?r.filter((i,o)=>{if(!a.routes[i.route.id].hasLoader)return!1;if(u(i,o)||c(i,o))return!0;if(i.route.shouldRevalidate){var h;let P=i.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((h=t[0])===null||h===void 0?void 0:h.params)||{},nextUrl:new URL(e,window.origin),nextParams:i.params,defaultShouldRevalidate:!0});if(typeof P=="boolean")return P}return!0}):r.filter((i,o)=>{let m=a.routes[i.route.id];return(l==="assets"||m.hasLoader)&&(u(i,o)||c(i,o))})}function b(e,r,t){let a=v(e);return E(r.filter(n=>t.routes[n.route.id].hasLoader).map(n=>{let{pathname:l,search:f}=a,u=new URLSearchParams(f);return u.set("_data",n.route.id),`${l}?${u}`}))}function Y(e,r){return E(e.map(t=>{let a=r.routes[t.route.id],n=[a.module];return a.imports&&(n=n.concat(a.imports)),n}).flat(1))}function E(e){return[...new Set(e)]}function v(e){let r=H(e);return r.search===void 0&&(r.search=""),r}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function G(){let e=s.useContext(U);return L(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function V(){let e=s.useContext(O);return L(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}const x=s.createContext(void 0);x.displayName="Remix";function S(){let e=s.useContext(x);return L(e,"You must render this element inside a <Remix> element"),e}function _(e,r){let[t,a]=s.useState(!1),[n,l]=s.useState(!1),{onFocus:f,onBlur:u,onMouseEnter:c,onMouseLeave:y,onTouchStart:i}=r;s.useEffect(()=>{e==="render"&&l(!0)},[e]);let o=()=>{e==="intent"&&a(!0)},m=()=>{e==="intent"&&(a(!1),l(!1))};return s.useEffect(()=>{if(t){let h=setTimeout(()=>{l(!0)},100);return()=>{clearTimeout(h)}}},[t]),[n,{onFocus:p(f,o),onBlur:p(u,m),onMouseEnter:p(c,o),onMouseLeave:p(y,m),onTouchStart:p(i,o)}]}const N=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;let W=s.forwardRef(({to:e,prefetch:r="none",...t},a)=>{let n=typeof e=="string"&&N.test(e),l=g(e),[f,u]=_(r,t);return s.createElement(s.Fragment,null,s.createElement($,d({ref:a,to:e},t,u)),f&&!n?s.createElement(D,{page:l}):null)});W.displayName="NavLink";let C=s.forwardRef(({to:e,prefetch:r="none",...t},a)=>{let n=typeof e=="string"&&N.test(e),l=g(e),[f,u]=_(r,t);return s.createElement(s.Fragment,null,s.createElement(F,d({ref:a,to:e},t,u)),f&&!n?s.createElement(D,{page:l}):null)});C.displayName="Link";function p(e,r){return t=>{e&&e(t),t.defaultPrevented||r(t)}}function D({page:e,...r}){let{router:t}=G(),a=s.useMemo(()=>M(t.routes,e),[t.routes,e]);return a?s.createElement(q,d({page:e,matches:a},r)):(console.warn(`Tried to prefetch ${e} but no routes matched.`),null)}function X(e){let{manifest:r,routeModules:t}=S(),[a,n]=s.useState([]);return s.useEffect(()=>{let l=!1;return B(e,r,t).then(f=>{l||n(f)}),()=>{l=!0}},[e,r,t]),a}function q({page:e,matches:r,...t}){let a=T(),{manifest:n}=S(),{matches:l}=V(),f=s.useMemo(()=>k(e,r,l,n,a,"data"),[e,r,l,n,a]),u=s.useMemo(()=>k(e,r,l,n,a,"assets"),[e,r,l,n,a]),c=s.useMemo(()=>b(e,f,n),[f,e,n]),y=s.useMemo(()=>Y(u,n),[u,n]),i=X(u);return s.createElement(s.Fragment,null,c.map(o=>s.createElement("link",d({key:o,rel:"prefetch",as:"fetch",href:o},t))),y.map(o=>s.createElement("link",d({key:o,rel:"modulepreload",href:o},t))),i.map(o=>s.createElement("link",d({key:o.href},o))))}const R=({children:e,className:r,...t})=>{const a=`
    underline
    text-blue-800
    ${r||""}
  `;return"to"in t?w(C,{...t,className:a,"data-testid":"internal-link",children:e}):w("a",{...t,"data-testid":"external-link",className:a,children:e})};try{R.displayName="Link",R.__docgenInfo={description:`returns either a Link component or anchor element,
dependent upon whether user passes a "to" or "href" prop, respectively.`,displayName:"Link",props:{}}}catch{}export{R as L,C as a};
//# sourceMappingURL=Link-fcfcd474.js.map
