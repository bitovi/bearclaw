import{a,b as H,i as J}from"/build/_shared/chunk-BPUBDSZ4.js";import{E as S,G as _,H as $,I as W,L as w,M as B,Q as D,R as L,Z as Y,_ as Z,d as t,da as M,e as V,ea as q,h as v,ha as l,i as g,ia as A}from"/build/_shared/chunk-MLPEZQPG.js";import{a as K,b as G}from"/build/_shared/chunk-5HKR6QTR.js";import{d as b}from"/build/_shared/chunk-G5WX4PPA.js";W();Z();function R(r){return _("MuiCircularProgress",r)}var lr=$("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);B();V();var z=b(K());L();J();Y();H();q();A();var p=b(G()),Q=["className","color","disableShrink","size","style","thickness","value","variant"],m=r=>r,N,O,j,U,o=44,X=g(N||(N=m`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),rr=g(O||(O=m`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),er=r=>{let{classes:e,variant:s,color:i,disableShrink:f}=r,u={root:["root",s,`color${a(i)}`],svg:["svg"],circle:["circle",`circle${a(s)}`,f&&"circleDisableShrink"]};return S(u,R,e)},sr=l("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{let{ownerState:s}=r;return[e.root,e[s.variant],e[`color${a(s.color)}`]]}})(({ownerState:r,theme:e})=>t({display:"inline-block"},r.variant==="determinate"&&{transition:e.transitions.create("transform")},r.color!=="inherit"&&{color:(e.vars||e).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&v(j||(j=m`
      animation: ${0} 1.4s linear infinite;
    `),X)),or=l("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,e)=>e.svg})({display:"block"}),tr=l("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{let{ownerState:s}=r;return[e.circle,e[`circle${a(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(({ownerState:r,theme:e})=>t({stroke:"currentColor"},r.variant==="determinate"&&{transition:e.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&v(U||(U=m`
      animation: ${0} 1.4s ease-in-out infinite;
    `),rr)),ir=z.forwardRef(function(e,s){let i=M({props:e,name:"MuiCircularProgress"}),{className:f,color:u="primary",disableShrink:E=!1,size:d=40,style:I,thickness:n=3.6,value:y=0,variant:T="indeterminate"}=i,F=w(i,Q),c=t({},i,{color:u,disableShrink:E,size:d,thickness:n,value:y,variant:T}),h=er(c),P={},k={},x={};if(T==="determinate"){let C=2*Math.PI*((o-n)/2);P.strokeDasharray=C.toFixed(3),x["aria-valuenow"]=Math.round(y),P.strokeDashoffset=`${((100-y)/100*C).toFixed(3)}px`,k.transform="rotate(-90deg)"}return(0,p.jsx)(sr,t({className:D(h.root,f),style:t({width:d,height:d},k,I),ownerState:c,ref:s,role:"progressbar"},x,F,{children:(0,p.jsx)(or,{className:h.svg,ownerState:c,viewBox:`${o/2} ${o/2} ${o} ${o}`,children:(0,p.jsx)(tr,{className:h.circle,style:P,ownerState:c,cx:o,cy:o,r:(o-n)/2,fill:"none",strokeWidth:n})})}))}),ar=ir;export{ar as a};
