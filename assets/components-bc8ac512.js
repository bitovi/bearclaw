import{r as a}from"./index-de62f0e0.js";import{p as U,u as P,L as M,m as A,a as _,b as H,D as O,c as N,N as I}from"./index-8216d442.js";import{_ as $}from"./iframe-c25fd810.js";/**
 * @remix-run/react v1.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function c(){return c=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},c.apply(this,arguments)}/**
 * @remix-run/react v1.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function E(e,r){if(e===!1||e===null||typeof e>"u")throw new Error(r)}async function z(e,r){if(e.id in r)return r[e.id];try{let t=await $(()=>import(e.module),[],import.meta.url);return r[e.id]=t,t}catch{return window.location.reload(),new Promise(()=>{})}}/**
 * @remix-run/react v1.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function B(e){return e==null?!1:e.href==null?e.rel==="preload"&&(typeof e.imageSrcSet=="string"||typeof e.imagesrcset=="string")&&(typeof e.imageSizes=="string"||typeof e.imagesizes=="string"):typeof e.rel=="string"&&typeof e.href=="string"}async function j(e,r,t){return(await Promise.all(e.map(async n=>{let i=await z(r.routes[n.route.id],t);return i.links?i.links():[]}))).flat(1).filter(B).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="preload"?{...n,rel:"prefetch"}:{...n,rel:"prefetch",as:"style"})}function R(e,r,t,o,n,i){let l=b(e),u=(f,s)=>t[s]?f.route.id!==t[s].route.id:!0,d=(f,s)=>{var m;return t[s].pathname!==f.pathname||((m=t[s].route.path)===null||m===void 0?void 0:m.endsWith("*"))&&t[s].params["*"]!==f.params["*"]};return i==="data"&&n.search!==l.search?r.filter((f,s)=>{if(!o.routes[f.route.id].hasLoader)return!1;if(u(f,s)||d(f,s))return!0;if(f.route.shouldRevalidate){var p;let y=f.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((p=t[0])===null||p===void 0?void 0:p.params)||{},nextUrl:new URL(e,window.origin),nextParams:f.params,defaultShouldRevalidate:!0});if(typeof y=="boolean")return y}return!0}):r.filter((f,s)=>{let m=o.routes[f.route.id];return(i==="assets"||m.hasLoader)&&(u(f,s)||d(f,s))})}function W(e,r,t){let o=b(e);return w(r.filter(n=>t.routes[n.route.id].hasLoader).map(n=>{let{pathname:i,search:l}=o,u=new URLSearchParams(l);return u.set("_data",n.route.id),`${i}?${u}`}))}function Y(e,r){return w(e.map(t=>{let o=r.routes[t.route.id],n=[o.module];return o.imports&&(n=n.concat(o.imports)),n}).flat(1))}function w(e){return[...new Set(e)]}function b(e){let r=U(e);return r.search===void 0&&(r.search=""),r}/**
 * @remix-run/react v1.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const G={state:"idle",type:"init",data:void 0,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0,json:void 0,text:void 0,submission:void 0};/**
 * @remix-run/react v1.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function V(){let e=a.useContext(O);return E(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function X(){let e=a.useContext(N);return E(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}const x=a.createContext(void 0);x.displayName="Remix";function v(){let e=a.useContext(x);return E(e,"You must render this element inside a <Remix> element"),e}function S(e,r){let[t,o]=a.useState(!1),[n,i]=a.useState(!1),{onFocus:l,onBlur:u,onMouseEnter:d,onMouseLeave:h,onTouchStart:f}=r,s=a.useRef(null);a.useEffect(()=>{if(e==="render"&&i(!0),e==="viewport"){let y=T=>{T.forEach(F=>{i(F.isIntersecting)})},L=new IntersectionObserver(y,{threshold:.5});return s.current&&L.observe(s.current),()=>{L.disconnect()}}},[e]);let m=()=>{e==="intent"&&o(!0)},p=()=>{e==="intent"&&(o(!1),i(!1))};return a.useEffect(()=>{if(t){let y=setTimeout(()=>{i(!0)},100);return()=>{clearTimeout(y)}}},[t]),[n,s,{onFocus:g(l,m),onBlur:g(u,p),onMouseEnter:g(d,m),onMouseLeave:g(h,p),onTouchStart:g(f,m)}]}const k=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;let q=a.forwardRef(({to:e,prefetch:r="none",...t},o)=>{let n=typeof e=="string"&&k.test(e),i=P(e),[l,u,d]=S(r,t);return a.createElement(a.Fragment,null,a.createElement(I,c({},t,d,{ref:D(o,u),to:e})),l&&!n?a.createElement(C,{page:i}):null)});q.displayName="NavLink";let J=a.forwardRef(({to:e,prefetch:r="none",...t},o)=>{let n=typeof e=="string"&&k.test(e),i=P(e),[l,u,d]=S(r,t);return a.createElement(a.Fragment,null,a.createElement(M,c({},t,d,{ref:D(o,u),to:e})),l&&!n?a.createElement(C,{page:i}):null)});J.displayName="Link";function g(e,r){return t=>{e&&e(t),t.defaultPrevented||r(t)}}function C({page:e,...r}){let{router:t}=V(),o=a.useMemo(()=>A(t.routes,e),[t.routes,e]);return o?a.createElement(Q,c({page:e,matches:o},r)):(console.warn(`Tried to prefetch ${e} but no routes matched.`),null)}function K(e){let{manifest:r,routeModules:t}=v(),[o,n]=a.useState([]);return a.useEffect(()=>{let i=!1;return j(e,r,t).then(l=>{i||n(l)}),()=>{i=!0}},[e,r,t]),o}function Q({page:e,matches:r,...t}){let o=_(),{manifest:n}=v(),{matches:i}=X(),l=a.useMemo(()=>R(e,r,i,n,o,"data"),[e,r,i,n,o]),u=a.useMemo(()=>R(e,r,i,n,o,"assets"),[e,r,i,n,o]),d=a.useMemo(()=>W(e,l,n),[l,e,n]),h=a.useMemo(()=>Y(u,n),[u,n]),f=K(u);return a.createElement(a.Fragment,null,d.map(s=>a.createElement("link",c({key:s,rel:"prefetch",as:"fetch",href:s},t))),h.map(s=>a.createElement("link",c({key:s,rel:"modulepreload",href:s},t))),f.map(s=>a.createElement("link",c({key:s.href},s))))}function oe(){let e=H();return a.useMemo(()=>{let t={...ee({state:e.state,data:e.data,formMethod:e.formMethod,formAction:e.formAction,formEncType:e.formEncType,formData:e.formData,json:e.json,text:e.text," _hasFetcherDoneAnything ":e[" _hasFetcherDoneAnything "]}),load:e.load,submit:e.submit,Form:e.Form};return Z(t),t},[e])}function Z(e){let r=e.type;Object.defineProperty(e,"type",{get(){return r},set(o){r=o},configurable:!0,enumerable:!0});let t=e.submission;Object.defineProperty(e,"submission",{get(){return t},set(o){t=o},configurable:!0,enumerable:!0})}function ee(e){let{state:r,formMethod:t,formAction:o,formEncType:n,formData:i,json:l,text:u,data:d}=e,h=t!=null&&["POST","PUT","PATCH","DELETE"].includes(t.toUpperCase());if(r==="idle")return e[" _hasFetcherDoneAnything "]===!0?{state:"idle",type:"done",formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0,json:void 0,text:void 0,submission:void 0,data:d}:G;if(r==="submitting"&&t&&o&&n&&(i||l!==void 0||u!==void 0)){if(h)return{state:r,type:"actionSubmission",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:i,json:l,text:u,submission:{method:t.toUpperCase(),action:o,encType:n,formData:i,json:l,text:u,key:""},data:d};E(!1,"Encountered an unexpected fetcher scenario in useFetcher()")}if(r==="loading"&&t&&o&&n){if(h)return d?{state:r,type:"actionReload",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:i,json:l,text:u,submission:{method:t.toUpperCase(),action:o,encType:n,formData:i,json:l,text:u,key:""},data:d}:{state:r,type:"actionRedirect",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:i,json:l,text:u,submission:{method:t.toUpperCase(),action:o,encType:n,formData:i,json:l,text:u,key:""},data:void 0};{let s=new URL(o,window.location.origin);return i&&(s.search=new URLSearchParams(i.entries()).toString()),{state:"submitting",type:"loaderSubmission",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:i,json:l,text:u,submission:{method:t.toUpperCase(),action:s.pathname+s.search,encType:n,formData:i,json:l,text:u,key:""},data:d}}}return{state:"loading",type:"normalLoad",formMethod:void 0,formAction:void 0,formData:void 0,json:void 0,text:void 0,formEncType:void 0,submission:void 0,data:d}}function D(...e){return r=>{e.forEach(t=>{typeof t=="function"?t(r):t!=null&&(t.current=r)})}}export{J as L,oe as u};
//# sourceMappingURL=components-bc8ac512.js.map
