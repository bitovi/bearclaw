import{_ as A}from"./emotion-use-insertion-effect-with-fallbacks.browser.esm-c604b0e9.js";import{_ as ie,c as C}from"./identifier-6112594b.js";import{r as a,R as W}from"./index-f1f749bf.js";import{T as fe,b as ye,k as re,s as oe,c as Te,g as Oe,u as de,a as H,d as je}from"./TransitionGroupContext-8dd40c29.js";import{j as U,a as Ae}from"./jsx-runtime-d156d728.js";import{_ as Xe}from"./assertThisInitialized-081f9914.js";import{_ as Ye}from"./inheritsLoose-c82a83d4.js";let G=!0,te=!1,he;const We={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function He(e){const{type:t,tagName:r}=e;return!!(r==="INPUT"&&We[t]&&!e.readOnly||r==="TEXTAREA"&&!e.readOnly||e.isContentEditable)}function Ge(e){e.metaKey||e.altKey||e.ctrlKey||(G=!0)}function ee(){G=!1}function qe(){this.visibilityState==="hidden"&&te&&(G=!0)}function Je(e){e.addEventListener("keydown",Ge,!0),e.addEventListener("mousedown",ee,!0),e.addEventListener("pointerdown",ee,!0),e.addEventListener("touchstart",ee,!0),e.addEventListener("visibilitychange",qe,!0)}function Qe(e){const{target:t}=e;try{return t.matches(":focus-visible")}catch{}return G||He(t)}function Ze(){const e=a.useCallback(n=>{n!=null&&Je(n.ownerDocument)},[]),t=a.useRef(!1);function r(){return t.current?(te=!0,window.clearTimeout(he),he=window.setTimeout(()=>{te=!1},100),t.current=!1,!0):!1}function l(n){return Qe(n)?(t.current=!0,!0):!1}return{isFocusVisibleRef:t,onFocus:l,onBlur:r,ref:e}}function se(e,t){var r=function(i){return t&&a.isValidElement(i)?t(i):i},l=Object.create(null);return e&&a.Children.map(e,function(n){return n}).forEach(function(n){l[n.key]=r(n)}),l}function et(e,t){e=e||{},t=t||{};function r(d){return d in t?t[d]:e[d]}var l=Object.create(null),n=[];for(var i in e)i in t?n.length&&(l[i]=n,n=[]):n.push(i);var o,c={};for(var u in t){if(l[u])for(o=0;o<l[u].length;o++){var p=l[u][o];c[l[u][o]]=r(p)}c[u]=r(u)}for(o=0;o<n.length;o++)c[n[o]]=r(n[o]);return c}function S(e,t,r){return r[t]!=null?r[t]:e.props[t]}function tt(e,t){return se(e.children,function(r){return a.cloneElement(r,{onExited:t.bind(null,r),in:!0,appear:S(r,"appear",e),enter:S(r,"enter",e),exit:S(r,"exit",e)})})}function nt(e,t,r){var l=se(e.children),n=et(t,l);return Object.keys(n).forEach(function(i){var o=n[i];if(a.isValidElement(o)){var c=i in t,u=i in l,p=t[i],d=a.isValidElement(p)&&!p.props.in;u&&(!c||d)?n[i]=a.cloneElement(o,{onExited:r.bind(null,o),in:!0,exit:S(o,"exit",e),enter:S(o,"enter",e)}):!u&&c&&!d?n[i]=a.cloneElement(o,{in:!1}):u&&c&&a.isValidElement(p)&&(n[i]=a.cloneElement(o,{onExited:r.bind(null,o),in:p.props.in,exit:S(o,"exit",e),enter:S(o,"enter",e)}))}}),n}var it=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},rt={component:"div",childFactory:function(t){return t}},ae=function(e){Ye(t,e);function t(l,n){var i;i=e.call(this,l,n)||this;var o=i.handleExited.bind(Xe(i));return i.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},i}var r=t.prototype;return r.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},r.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(n,i){var o=i.children,c=i.handleExited,u=i.firstRender;return{children:u?tt(n,c):nt(n,o,c),firstRender:!1}},r.handleExited=function(n,i){var o=se(this.props.children);n.key in o||(n.props.onExited&&n.props.onExited(i),this.mounted&&this.setState(function(c){var u=A({},c.children);return delete u[n.key],{children:u}}))},r.render=function(){var n=this.props,i=n.component,o=n.childFactory,c=ie(n,["component","childFactory"]),u=this.state.contextValue,p=it(this.state.children).map(o);return delete c.appear,delete c.enter,delete c.exit,i===null?W.createElement(fe.Provider,{value:u},p):W.createElement(fe.Provider,{value:u},W.createElement(i,c,p))},t}(W.Component);ae.propTypes={};ae.defaultProps=rt;const ot=ae;function st(e){const{className:t,classes:r,pulsate:l=!1,rippleX:n,rippleY:i,rippleSize:o,in:c,onExited:u,timeout:p}=e,[d,g]=a.useState(!1),b=C(t,r.ripple,r.rippleVisible,l&&r.ripplePulsate),w={width:o,height:o,top:-(o/2)+i,left:-(o/2)+n},h=C(r.child,d&&r.childLeaving,l&&r.childPulsate);return!c&&!d&&g(!0),a.useEffect(()=>{if(!c&&u!=null){const R=setTimeout(u,p);return()=>{clearTimeout(R)}}},[u,c,p]),U("span",{className:b,style:w,children:U("span",{className:h})})}const at=ye("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),m=at,lt=["center","classes","className"];let q=e=>e,me,be,ge,Re;const ne=550,ut=80,ct=re(me||(me=q`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),pt=re(be||(be=q`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),ft=re(ge||(ge=q`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),dt=oe("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),ht=oe(st,{name:"MuiTouchRipple",slot:"Ripple"})(Re||(Re=q`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),m.rippleVisible,ct,ne,({theme:e})=>e.transitions.easing.easeInOut,m.ripplePulsate,({theme:e})=>e.transitions.duration.shorter,m.child,m.childLeaving,pt,ne,({theme:e})=>e.transitions.easing.easeInOut,m.childPulsate,ft,({theme:e})=>e.transitions.easing.easeInOut),mt=a.forwardRef(function(t,r){const l=Te({props:t,name:"MuiTouchRipple"}),{center:n=!1,classes:i={},className:o}=l,c=ie(l,lt),[u,p]=a.useState([]),d=a.useRef(0),g=a.useRef(null);a.useEffect(()=>{g.current&&(g.current(),g.current=null)},[u]);const b=a.useRef(!1),w=a.useRef(null),h=a.useRef(null),R=a.useRef(null);a.useEffect(()=>()=>{clearTimeout(w.current)},[]);const _=a.useCallback(f=>{const{pulsate:y,rippleX:T,rippleY:D,rippleSize:I,cb:z}=f;p(M=>[...M,U(ht,{classes:{ripple:C(i.ripple,m.ripple),rippleVisible:C(i.rippleVisible,m.rippleVisible),ripplePulsate:C(i.ripplePulsate,m.ripplePulsate),child:C(i.child,m.child),childLeaving:C(i.childLeaving,m.childLeaving),childPulsate:C(i.childPulsate,m.childPulsate)},timeout:ne,pulsate:y,rippleX:T,rippleY:D,rippleSize:I},d.current)]),d.current+=1,g.current=z},[i]),$=a.useCallback((f={},y={},T=()=>{})=>{const{pulsate:D=!1,center:I=n||y.pulsate,fakeElement:z=!1}=y;if((f==null?void 0:f.type)==="mousedown"&&b.current){b.current=!1;return}(f==null?void 0:f.type)==="touchstart"&&(b.current=!0);const M=z?null:R.current,B=M?M.getBoundingClientRect():{width:0,height:0,left:0,top:0};let x,P,L;if(I||f===void 0||f.clientX===0&&f.clientY===0||!f.clientX&&!f.touches)x=Math.round(B.width/2),P=Math.round(B.height/2);else{const{clientX:k,clientY:V}=f.touches&&f.touches.length>0?f.touches[0]:f;x=Math.round(k-B.left),P=Math.round(V-B.top)}if(I)L=Math.sqrt((2*B.width**2+B.height**2)/3),L%2===0&&(L+=1);else{const k=Math.max(Math.abs((M?M.clientWidth:0)-x),x)*2+2,V=Math.max(Math.abs((M?M.clientHeight:0)-P),P)*2+2;L=Math.sqrt(k**2+V**2)}f!=null&&f.touches?h.current===null&&(h.current=()=>{_({pulsate:D,rippleX:x,rippleY:P,rippleSize:L,cb:T})},w.current=setTimeout(()=>{h.current&&(h.current(),h.current=null)},ut)):_({pulsate:D,rippleX:x,rippleY:P,rippleSize:L,cb:T})},[n,_]),K=a.useCallback(()=>{$({},{pulsate:!0})},[$]),N=a.useCallback((f,y)=>{if(clearTimeout(w.current),(f==null?void 0:f.type)==="touchend"&&h.current){h.current(),h.current=null,w.current=setTimeout(()=>{N(f,y)});return}h.current=null,p(T=>T.length>0?T.slice(1):T),g.current=y},[]);return a.useImperativeHandle(r,()=>({pulsate:K,start:$,stop:N}),[K,$,N]),U(dt,A({className:C(m.root,i.root,o),ref:R},c,{children:U(ot,{component:null,exit:!0,children:u})}))}),bt=mt;function gt(e){return Oe("MuiButtonBase",e)}const Rt=ye("MuiButtonBase",["root","disabled","focusVisible"]),yt=Rt,Tt=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],Mt=e=>{const{disabled:t,focusVisible:r,focusVisibleClassName:l,classes:n}=e,o=je({root:["root",t&&"disabled",r&&"focusVisible"]},gt,n);return r&&l&&(o.root+=` ${l}`),o},Et=oe("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${yt.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),Ct=a.forwardRef(function(t,r){const l=Te({props:t,name:"MuiButtonBase"}),{action:n,centerRipple:i=!1,children:o,className:c,component:u="button",disabled:p=!1,disableRipple:d=!1,disableTouchRipple:g=!1,focusRipple:b=!1,LinkComponent:w="a",onBlur:h,onClick:R,onContextMenu:_,onDragLeave:$,onFocus:K,onFocusVisible:N,onKeyDown:f,onKeyUp:y,onMouseDown:T,onMouseLeave:D,onMouseUp:I,onTouchEnd:z,onTouchMove:M,onTouchStart:B,tabIndex:x=0,TouchRippleProps:P,touchRippleRef:L,type:k}=l,V=ie(l,Tt),O=a.useRef(null),E=a.useRef(null),Me=de(E,L),{isFocusVisibleRef:le,onFocus:Ee,onBlur:Ce,ref:xe}=Ze(),[F,X]=a.useState(!1);p&&F&&X(!1),a.useImperativeHandle(n,()=>({focusVisible:()=>{X(!0),O.current.focus()}}),[]);const[J,Ve]=a.useState(!1);a.useEffect(()=>{Ve(!0)},[]);const ve=J&&!d&&!p;a.useEffect(()=>{F&&b&&!d&&J&&E.current.pulsate()},[d,b,F,J]);function v(s,ce,ze=g){return H(pe=>(ce&&ce(pe),!ze&&E.current&&E.current[s](pe),!0))}const we=v("start",T),Be=v("stop",_),Pe=v("stop",$),Le=v("stop",I),De=v("stop",s=>{F&&s.preventDefault(),D&&D(s)}),ke=v("start",B),Fe=v("stop",z),Se=v("stop",M),$e=v("stop",s=>{Ce(s),le.current===!1&&X(!1),h&&h(s)},!1),Ne=H(s=>{O.current||(O.current=s.currentTarget),Ee(s),le.current===!0&&(X(!0),N&&N(s)),K&&K(s)}),Q=()=>{const s=O.current;return u&&u!=="button"&&!(s.tagName==="A"&&s.href)},Z=a.useRef(!1),Ie=H(s=>{b&&!Z.current&&F&&E.current&&s.key===" "&&(Z.current=!0,E.current.stop(s,()=>{E.current.start(s)})),s.target===s.currentTarget&&Q()&&s.key===" "&&s.preventDefault(),f&&f(s),s.target===s.currentTarget&&Q()&&s.key==="Enter"&&!p&&(s.preventDefault(),R&&R(s))}),Ue=H(s=>{b&&s.key===" "&&E.current&&F&&!s.defaultPrevented&&(Z.current=!1,E.current.stop(s,()=>{E.current.pulsate(s)})),y&&y(s),R&&s.target===s.currentTarget&&Q()&&s.key===" "&&!s.defaultPrevented&&R(s)});let Y=u;Y==="button"&&(V.href||V.to)&&(Y=w);const j={};Y==="button"?(j.type=k===void 0?"button":k,j.disabled=p):(!V.href&&!V.to&&(j.role="button"),p&&(j["aria-disabled"]=p));const _e=de(r,xe,O),ue=A({},l,{centerRipple:i,component:u,disabled:p,disableRipple:d,disableTouchRipple:g,focusRipple:b,tabIndex:x,focusVisible:F}),Ke=Mt(ue);return Ae(Et,A({as:Y,className:C(Ke.root,c),ownerState:ue,onBlur:$e,onClick:R,onContextMenu:Be,onFocus:Ne,onKeyDown:Ie,onKeyUp:Ue,onMouseDown:we,onMouseLeave:De,onMouseUp:Le,onDragLeave:Pe,onTouchEnd:Fe,onTouchMove:Se,onTouchStart:ke,ref:_e,tabIndex:p?-1:x,type:k},j,V,{children:[o,ve?U(bt,A({ref:Me,center:i},P)):null]}))}),kt=Ct;export{kt as B,Ze as u};
//# sourceMappingURL=ButtonBase-4508e7c3.js.map
