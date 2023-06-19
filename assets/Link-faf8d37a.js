import{j as P}from"./jsx-runtime-ad672792.js";import{r as s}from"./index-f1f749bf.js";import{p as H,j as g,L as F,m as M,u as T,D as U,k as O,N as $}from"./index-e50b599f.js";import{_ as A}from"./iframe-88dd2de7.js";/**
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
 */function z(e){return e==null?!1:e.href==null?e.rel==="preload"&&(typeof e.imageSrcSet=="string"||typeof e.imagesrcset=="string")&&(typeof e.imageSizes=="string"||typeof e.imagesizes=="string"):typeof e.rel=="string"&&typeof e.href=="string"}async function B(e,r,t){return(await Promise.all(e.map(async n=>{let o=await I(r.routes[n.route.id],t);return o.links?o.links():[]}))).flat(1).filter(z).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="preload"?{...n,rel:"prefetch"}:{...n,rel:"prefetch",as:"style"})}function k(e,r,t,a,n,o){let f=v(e),u=(l,i)=>t[i]?l.route.id!==t[i].route.id:!0,c=(l,i)=>{var m;return t[i].pathname!==l.pathname||((m=t[i].route.path)===null||m===void 0?void 0:m.endsWith("*"))&&t[i].params["*"]!==l.params["*"]};return o==="data"&&n.search!==f.search?r.filter((l,i)=>{if(!a.routes[l.route.id].hasLoader)return!1;if(u(l,i)||c(l,i))return!0;if(l.route.shouldRevalidate){var h;let w=l.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((h=t[0])===null||h===void 0?void 0:h.params)||{},nextUrl:new URL(e,window.origin),nextParams:l.params,defaultShouldRevalidate:!0});if(typeof w=="boolean")return w}return!0}):r.filter((l,i)=>{let m=a.routes[l.route.id];return(o==="assets"||m.hasLoader)&&(u(l,i)||c(l,i))})}function b(e,r,t){let a=v(e);return E(r.filter(n=>t.routes[n.route.id].hasLoader).map(n=>{let{pathname:o,search:f}=a,u=new URLSearchParams(f);return u.set("_data",n.route.id),`${o}?${u}`}))}function Y(e,r){return E(e.map(t=>{let a=r.routes[t.route.id],n=[a.module];return a.imports&&(n=n.concat(a.imports)),n}).flat(1))}function E(e){return[...new Set(e)]}function v(e){let r=H(e);return r.search===void 0&&(r.search=""),r}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function G(){let e=s.useContext(U);return L(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function V(){let e=s.useContext(O);return L(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}const x=s.createContext(void 0);x.displayName="Remix";function S(){let e=s.useContext(x);return L(e,"You must render this element inside a <Remix> element"),e}function _(e,r){let[t,a]=s.useState(!1),[n,o]=s.useState(!1),{onFocus:f,onBlur:u,onMouseEnter:c,onMouseLeave:y,onTouchStart:l}=r;s.useEffect(()=>{e==="render"&&o(!0)},[e]);let i=()=>{e==="intent"&&a(!0)},m=()=>{e==="intent"&&(a(!1),o(!1))};return s.useEffect(()=>{if(t){let h=setTimeout(()=>{o(!0)},100);return()=>{clearTimeout(h)}}},[t]),[n,{onFocus:p(f,i),onBlur:p(u,m),onMouseEnter:p(c,i),onMouseLeave:p(y,m),onTouchStart:p(l,i)}]}const N=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;let W=s.forwardRef(({to:e,prefetch:r="none",...t},a)=>{let n=typeof e=="string"&&N.test(e),o=g(e),[f,u]=_(r,t);return s.createElement(s.Fragment,null,s.createElement($,d({ref:a,to:e},t,u)),f&&!n?s.createElement(D,{page:o}):null)});W.displayName="NavLink";let C=s.forwardRef(({to:e,prefetch:r="none",...t},a)=>{let n=typeof e=="string"&&N.test(e),o=g(e),[f,u]=_(r,t);return s.createElement(s.Fragment,null,s.createElement(F,d({ref:a,to:e},t,u)),f&&!n?s.createElement(D,{page:o}):null)});C.displayName="Link";function p(e,r){return t=>{e&&e(t),t.defaultPrevented||r(t)}}function D({page:e,...r}){let{router:t}=G(),a=s.useMemo(()=>M(t.routes,e),[t.routes,e]);return a?s.createElement(q,d({page:e,matches:a},r)):(console.warn(`Tried to prefetch ${e} but no routes matched.`),null)}function X(e){let{manifest:r,routeModules:t}=S(),[a,n]=s.useState([]);return s.useEffect(()=>{let o=!1;return B(e,r,t).then(f=>{o||n(f)}),()=>{o=!0}},[e,r,t]),a}function q({page:e,matches:r,...t}){let a=T(),{manifest:n}=S(),{matches:o}=V(),f=s.useMemo(()=>k(e,r,o,n,a,"data"),[e,r,o,n,a]),u=s.useMemo(()=>k(e,r,o,n,a,"assets"),[e,r,o,n,a]),c=s.useMemo(()=>b(e,f,n),[f,e,n]),y=s.useMemo(()=>Y(u,n),[u,n]),l=X(u);return s.createElement(s.Fragment,null,c.map(i=>s.createElement("link",d({key:i,rel:"prefetch",as:"fetch",href:i},t))),y.map(i=>s.createElement("link",d({key:i,rel:"modulepreload",href:i},t))),l.map(i=>s.createElement("link",d({key:i.href},i))))}const R=s.forwardRef(function({children:r,className:t,...a},n){const o=`
      underline
      text-blue-800
      ${t||""}
    `;return"to"in a?P(C,{ref:n,...a,className:o,"data-testid":"internal-link",children:r}):P("a",{ref:n,...a,"data-testid":"external-link",className:o,children:r})});try{R.displayName="Link",R.__docgenInfo={description:`returns either a Link component or anchor element,
dependent upon whether user passes a "to" or "href" prop, respectively.`,displayName:"Link",props:{}}}catch{}export{R as L,C as a};
//# sourceMappingURL=Link-faf8d37a.js.map
