import{r as i}from"./index-f1f749bf.js";import{p as C,j as P,L as v,m as F,u as x,k as A,D as U,l as M,N as _}from"./index-561979eb.js";import{_ as H}from"./iframe-9aea85db.js";/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function c(){return c=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},c.apply(this,arguments)}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function E(e,r){if(e===!1||e===null||typeof e>"u")throw new Error(r)}async function N(e,r){if(e.id in r)return r[e.id];try{let t=await H(()=>import(e.module),[],import.meta.url);return r[e.id]=t,t}catch{return window.location.reload(),new Promise(()=>{})}}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function O(e){return e==null?!1:e.href==null?e.rel==="preload"&&(typeof e.imageSrcSet=="string"||typeof e.imagesrcset=="string")&&(typeof e.imageSizes=="string"||typeof e.imagesizes=="string"):typeof e.rel=="string"&&typeof e.href=="string"}async function I(e,r,t){return(await Promise.all(e.map(async n=>{let a=await N(r.routes[n.route.id],t);return a.links?a.links():[]}))).flat(1).filter(O).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="preload"?{...n,rel:"prefetch"}:{...n,rel:"prefetch",as:"style"})}function L(e,r,t,o,n,a){let u=D(e),l=(f,s)=>t[s]?f.route.id!==t[s].route.id:!0,h=(f,s)=>{var d;return t[s].pathname!==f.pathname||((d=t[s].route.path)===null||d===void 0?void 0:d.endsWith("*"))&&t[s].params["*"]!==f.params["*"]};return a==="data"&&n.search!==u.search?r.filter((f,s)=>{if(!o.routes[f.route.id].hasLoader)return!1;if(l(f,s)||h(f,s))return!0;if(f.route.shouldRevalidate){var p;let g=f.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((p=t[0])===null||p===void 0?void 0:p.params)||{},nextUrl:new URL(e,window.origin),nextParams:f.params,defaultShouldRevalidate:!0});if(typeof g=="boolean")return g}return!0}):r.filter((f,s)=>{let d=o.routes[f.route.id];return(a==="assets"||d.hasLoader)&&(l(f,s)||h(f,s))})}function $(e,r,t){let o=D(e);return R(r.filter(n=>t.routes[n.route.id].hasLoader).map(n=>{let{pathname:a,search:u}=o,l=new URLSearchParams(u);return l.set("_data",n.route.id),`${a}?${l}`}))}function z(e,r){return R(e.map(t=>{let o=r.routes[t.route.id],n=[o.module];return o.imports&&(n=n.concat(o.imports)),n}).flat(1))}function R(e){return[...new Set(e)]}function D(e){let r=C(e);return r.search===void 0&&(r.search=""),r}/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const B={state:"idle",type:"init",data:void 0,formMethod:void 0,formAction:void 0,formData:void 0,formEncType:void 0,submission:void 0};/**
 * @remix-run/react v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function W(){let e=i.useContext(U);return E(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function Y(){let e=i.useContext(M);return E(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}const w=i.createContext(void 0);w.displayName="Remix";function T(){let e=i.useContext(w);return E(e,"You must render this element inside a <Remix> element"),e}function b(e,r){let[t,o]=i.useState(!1),[n,a]=i.useState(!1),{onFocus:u,onBlur:l,onMouseEnter:h,onMouseLeave:m,onTouchStart:f}=r;i.useEffect(()=>{e==="render"&&a(!0)},[e]);let s=()=>{e==="intent"&&o(!0)},d=()=>{e==="intent"&&(o(!1),a(!1))};return i.useEffect(()=>{if(t){let p=setTimeout(()=>{a(!0)},100);return()=>{clearTimeout(p)}}},[t]),[n,{onFocus:y(u,s),onBlur:y(l,d),onMouseEnter:y(h,s),onMouseLeave:y(m,d),onTouchStart:y(f,s)}]}const S=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;let G=i.forwardRef(({to:e,prefetch:r="none",...t},o)=>{let n=typeof e=="string"&&S.test(e),a=P(e),[u,l]=b(r,t);return i.createElement(i.Fragment,null,i.createElement(_,c({ref:o,to:e},t,l)),u&&!n?i.createElement(k,{page:a}):null)});G.displayName="NavLink";let V=i.forwardRef(({to:e,prefetch:r="none",...t},o)=>{let n=typeof e=="string"&&S.test(e),a=P(e),[u,l]=b(r,t);return i.createElement(i.Fragment,null,i.createElement(v,c({ref:o,to:e},t,l)),u&&!n?i.createElement(k,{page:a}):null)});V.displayName="Link";function y(e,r){return t=>{e&&e(t),t.defaultPrevented||r(t)}}function k({page:e,...r}){let{router:t}=W(),o=i.useMemo(()=>F(t.routes,e),[t.routes,e]);return o?i.createElement(q,c({page:e,matches:o},r)):(console.warn(`Tried to prefetch ${e} but no routes matched.`),null)}function X(e){let{manifest:r,routeModules:t}=T(),[o,n]=i.useState([]);return i.useEffect(()=>{let a=!1;return I(e,r,t).then(u=>{a||n(u)}),()=>{a=!0}},[e,r,t]),o}function q({page:e,matches:r,...t}){let o=x(),{manifest:n}=T(),{matches:a}=Y(),u=i.useMemo(()=>L(e,r,a,n,o,"data"),[e,r,a,n,o]),l=i.useMemo(()=>L(e,r,a,n,o,"assets"),[e,r,a,n,o]),h=i.useMemo(()=>$(e,u,n),[u,e,n]),m=i.useMemo(()=>z(l,n),[l,n]),f=X(l);return i.createElement(i.Fragment,null,h.map(s=>i.createElement("link",c({key:s,rel:"prefetch",as:"fetch",href:s},t))),m.map(s=>i.createElement("link",c({key:s,rel:"modulepreload",href:s},t))),f.map(s=>i.createElement("link",c({key:s.href},s))))}function ee(){let e=A();return i.useMemo(()=>{let t={...K({state:e.state,data:e.data,formMethod:e.formMethod,formAction:e.formAction,formData:e.formData,formEncType:e.formEncType," _hasFetcherDoneAnything ":e[" _hasFetcherDoneAnything "]}),load:e.load,submit:e.submit,Form:e.Form};return J(t),t},[e])}function J(e){let r=e.type;Object.defineProperty(e,"type",{get(){return r},set(o){r=o},configurable:!0,enumerable:!0});let t=e.submission;Object.defineProperty(e,"submission",{get(){return t},set(o){t=o},configurable:!0,enumerable:!0})}function K(e){let{state:r,formMethod:t,formAction:o,formEncType:n,formData:a,data:u}=e,l=t!=null&&["POST","PUT","PATCH","DELETE"].includes(t.toUpperCase());if(r==="idle")return e[" _hasFetcherDoneAnything "]===!0?{state:"idle",type:"done",formMethod:void 0,formAction:void 0,formData:void 0,formEncType:void 0,submission:void 0,data:u}:B;if(r==="submitting"&&t&&o&&n&&a){if(l)return{state:r,type:"actionSubmission",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:a,submission:{method:t.toUpperCase(),action:o,encType:n,formData:a,key:""},data:u};E(!1,"Encountered an unexpected fetcher scenario in useFetcher()")}if(r==="loading"&&t&&o&&n&&a){if(l)return u?{state:r,type:"actionReload",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:a,submission:{method:t.toUpperCase(),action:o,encType:n,formData:a,key:""},data:u}:{state:r,type:"actionRedirect",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:a,submission:{method:t.toUpperCase(),action:o,encType:n,formData:a,key:""},data:void 0};{let m=new URL(o,window.location.origin);return m.search=new URLSearchParams(a.entries()).toString(),{state:"submitting",type:"loaderSubmission",formMethod:t.toUpperCase(),formAction:o,formEncType:n,formData:a,submission:{method:t.toUpperCase(),action:m.pathname+m.search,encType:n,formData:a,key:""},data:u}}}return{state:"loading",type:"normalLoad",formMethod:void 0,formAction:void 0,formData:void 0,formEncType:void 0,submission:void 0,data:u}}export{V as L,ee as u};
//# sourceMappingURL=components-4dfe50c5.js.map
