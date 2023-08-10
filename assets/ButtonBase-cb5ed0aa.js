import{_ as A}from"./emotion-use-insertion-effect-with-fallbacks.browser.esm-3dd2622f.js";import{_ as re}from"./identifier-16b7543e.js";import{r as a,a as W}from"./index-de62f0e0.js";import{c as C}from"./index-5d468162.js";import{T as fe,a as ye,s as ie,g as Oe,u as de,d as H,c as je}from"./TransitionGroupContext-6661e146.js";import{k as oe,u as Te}from"./useThemeProps-40add02b.js";import{a as U,j as Ae}from"./jsx-runtime-84fe5346.js";import{_ as Xe}from"./assertThisInitialized-081f9914.js";import{_ as Ye}from"./inheritsLoose-c82a83d4.js";let G=!0,te=!1,he;const We={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function He(e){const{type:t,tagName:i}=e;return!!(i==="INPUT"&&We[t]&&!e.readOnly||i==="TEXTAREA"&&!e.readOnly||e.isContentEditable)}function Ge(e){e.metaKey||e.altKey||e.ctrlKey||(G=!0)}function ee(){G=!1}function qe(){this.visibilityState==="hidden"&&te&&(G=!0)}function Je(e){e.addEventListener("keydown",Ge,!0),e.addEventListener("mousedown",ee,!0),e.addEventListener("pointerdown",ee,!0),e.addEventListener("touchstart",ee,!0),e.addEventListener("visibilitychange",qe,!0)}function Qe(e){const{target:t}=e;try{return t.matches(":focus-visible")}catch{}return G||He(t)}function Ze(){const e=a.useCallback(n=>{n!=null&&Je(n.ownerDocument)},[]),t=a.useRef(!1);function i(){return t.current?(te=!0,window.clearTimeout(he),he=window.setTimeout(()=>{te=!1},100),t.current=!1,!0):!1}function l(n){return Qe(n)?(t.current=!0,!0):!1}return{isFocusVisibleRef:t,onFocus:l,onBlur:i,ref:e}}function se(e,t){var i=function(r){return t&&a.isValidElement(r)?t(r):r},l=Object.create(null);return e&&a.Children.map(e,function(n){return n}).forEach(function(n){l[n.key]=i(n)}),l}function et(e,t){e=e||{},t=t||{};function i(d){return d in t?t[d]:e[d]}var l=Object.create(null),n=[];for(var r in e)r in t?n.length&&(l[r]=n,n=[]):n.push(r);var o,c={};for(var u in t){if(l[u])for(o=0;o<l[u].length;o++){var p=l[u][o];c[l[u][o]]=i(p)}c[u]=i(u)}for(o=0;o<n.length;o++)c[n[o]]=i(n[o]);return c}function S(e,t,i){return i[t]!=null?i[t]:e.props[t]}function tt(e,t){return se(e.children,function(i){return a.cloneElement(i,{onExited:t.bind(null,i),in:!0,appear:S(i,"appear",e),enter:S(i,"enter",e),exit:S(i,"exit",e)})})}function nt(e,t,i){var l=se(e.children),n=et(t,l);return Object.keys(n).forEach(function(r){var o=n[r];if(a.isValidElement(o)){var c=r in t,u=r in l,p=t[r],d=a.isValidElement(p)&&!p.props.in;u&&(!c||d)?n[r]=a.cloneElement(o,{onExited:i.bind(null,o),in:!0,exit:S(o,"exit",e),enter:S(o,"enter",e)}):!u&&c&&!d?n[r]=a.cloneElement(o,{in:!1}):u&&c&&a.isValidElement(p)&&(n[r]=a.cloneElement(o,{onExited:i.bind(null,o),in:p.props.in,exit:S(o,"exit",e),enter:S(o,"enter",e)}))}}),n}var rt=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},it={component:"div",childFactory:function(t){return t}},ae=function(e){Ye(t,e);function t(l,n){var r;r=e.call(this,l,n)||this;var o=r.handleExited.bind(Xe(r));return r.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},r}var i=t.prototype;return i.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},i.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(n,r){var o=r.children,c=r.handleExited,u=r.firstRender;return{children:u?tt(n,c):nt(n,o,c),firstRender:!1}},i.handleExited=function(n,r){var o=se(this.props.children);n.key in o||(n.props.onExited&&n.props.onExited(r),this.mounted&&this.setState(function(c){var u=A({},c.children);return delete u[n.key],{children:u}}))},i.render=function(){var n=this.props,r=n.component,o=n.childFactory,c=re(n,["component","childFactory"]),u=this.state.contextValue,p=rt(this.state.children).map(o);return delete c.appear,delete c.enter,delete c.exit,r===null?W.createElement(fe.Provider,{value:u},p):W.createElement(fe.Provider,{value:u},W.createElement(r,c,p))},t}(W.Component);ae.propTypes={};ae.defaultProps=it;const ot=ae;function st(e){const{className:t,classes:i,pulsate:l=!1,rippleX:n,rippleY:r,rippleSize:o,in:c,onExited:u,timeout:p}=e,[d,g]=a.useState(!1),b=C(t,i.ripple,i.rippleVisible,l&&i.ripplePulsate),w={width:o,height:o,top:-(o/2)+r,left:-(o/2)+n},h=C(i.child,d&&i.childLeaving,l&&i.childPulsate);return!c&&!d&&g(!0),a.useEffect(()=>{if(!c&&u!=null){const R=setTimeout(u,p);return()=>{clearTimeout(R)}}},[u,c,p]),U("span",{className:b,style:w,children:U("span",{className:h})})}const at=ye("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),m=at,lt=["center","classes","className"];let q=e=>e,me,be,ge,Re;const ne=550,ut=80,ct=oe(me||(me=q`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),pt=oe(be||(be=q`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),ft=oe(ge||(ge=q`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),dt=ie("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),ht=ie(st,{name:"MuiTouchRipple",slot:"Ripple"})(Re||(Re=q`
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
`),m.rippleVisible,ct,ne,({theme:e})=>e.transitions.easing.easeInOut,m.ripplePulsate,({theme:e})=>e.transitions.duration.shorter,m.child,m.childLeaving,pt,ne,({theme:e})=>e.transitions.easing.easeInOut,m.childPulsate,ft,({theme:e})=>e.transitions.easing.easeInOut),mt=a.forwardRef(function(t,i){const l=Te({props:t,name:"MuiTouchRipple"}),{center:n=!1,classes:r={},className:o}=l,c=re(l,lt),[u,p]=a.useState([]),d=a.useRef(0),g=a.useRef(null);a.useEffect(()=>{g.current&&(g.current(),g.current=null)},[u]);const b=a.useRef(!1),w=a.useRef(null),h=a.useRef(null),R=a.useRef(null);a.useEffect(()=>()=>{clearTimeout(w.current)},[]);const _=a.useCallback(f=>{const{pulsate:y,rippleX:T,rippleY:D,rippleSize:I,cb:z}=f;p(M=>[...M,U(ht,{classes:{ripple:C(r.ripple,m.ripple),rippleVisible:C(r.rippleVisible,m.rippleVisible),ripplePulsate:C(r.ripplePulsate,m.ripplePulsate),child:C(r.child,m.child),childLeaving:C(r.childLeaving,m.childLeaving),childPulsate:C(r.childPulsate,m.childPulsate)},timeout:ne,pulsate:y,rippleX:T,rippleY:D,rippleSize:I},d.current)]),d.current+=1,g.current=z},[r]),$=a.useCallback((f={},y={},T=()=>{})=>{const{pulsate:D=!1,center:I=n||y.pulsate,fakeElement:z=!1}=y;if((f==null?void 0:f.type)==="mousedown"&&b.current){b.current=!1;return}(f==null?void 0:f.type)==="touchstart"&&(b.current=!0);const M=z?null:R.current,B=M?M.getBoundingClientRect():{width:0,height:0,left:0,top:0};let x,P,L;if(I||f===void 0||f.clientX===0&&f.clientY===0||!f.clientX&&!f.touches)x=Math.round(B.width/2),P=Math.round(B.height/2);else{const{clientX:k,clientY:V}=f.touches&&f.touches.length>0?f.touches[0]:f;x=Math.round(k-B.left),P=Math.round(V-B.top)}if(I)L=Math.sqrt((2*B.width**2+B.height**2)/3),L%2===0&&(L+=1);else{const k=Math.max(Math.abs((M?M.clientWidth:0)-x),x)*2+2,V=Math.max(Math.abs((M?M.clientHeight:0)-P),P)*2+2;L=Math.sqrt(k**2+V**2)}f!=null&&f.touches?h.current===null&&(h.current=()=>{_({pulsate:D,rippleX:x,rippleY:P,rippleSize:L,cb:T})},w.current=setTimeout(()=>{h.current&&(h.current(),h.current=null)},ut)):_({pulsate:D,rippleX:x,rippleY:P,rippleSize:L,cb:T})},[n,_]),K=a.useCallback(()=>{$({},{pulsate:!0})},[$]),N=a.useCallback((f,y)=>{if(clearTimeout(w.current),(f==null?void 0:f.type)==="touchend"&&h.current){h.current(),h.current=null,w.current=setTimeout(()=>{N(f,y)});return}h.current=null,p(T=>T.length>0?T.slice(1):T),g.current=y},[]);return a.useImperativeHandle(i,()=>({pulsate:K,start:$,stop:N}),[K,$,N]),U(dt,A({className:C(m.root,r.root,o),ref:R},c,{children:U(ot,{component:null,exit:!0,children:u})}))}),bt=mt;function gt(e){return Oe("MuiButtonBase",e)}const Rt=ye("MuiButtonBase",["root","disabled","focusVisible"]),yt=Rt,Tt=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],Mt=e=>{const{disabled:t,focusVisible:i,focusVisibleClassName:l,classes:n}=e,o=je({root:["root",t&&"disabled",i&&"focusVisible"]},gt,n);return i&&l&&(o.root+=` ${l}`),o},Et=ie("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${yt.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),Ct=a.forwardRef(function(t,i){const l=Te({props:t,name:"MuiButtonBase"}),{action:n,centerRipple:r=!1,children:o,className:c,component:u="button",disabled:p=!1,disableRipple:d=!1,disableTouchRipple:g=!1,focusRipple:b=!1,LinkComponent:w="a",onBlur:h,onClick:R,onContextMenu:_,onDragLeave:$,onFocus:K,onFocusVisible:N,onKeyDown:f,onKeyUp:y,onMouseDown:T,onMouseLeave:D,onMouseUp:I,onTouchEnd:z,onTouchMove:M,onTouchStart:B,tabIndex:x=0,TouchRippleProps:P,touchRippleRef:L,type:k}=l,V=re(l,Tt),O=a.useRef(null),E=a.useRef(null),Me=de(E,L),{isFocusVisibleRef:le,onFocus:Ee,onBlur:Ce,ref:xe}=Ze(),[F,X]=a.useState(!1);p&&F&&X(!1),a.useImperativeHandle(n,()=>({focusVisible:()=>{X(!0),O.current.focus()}}),[]);const[J,Ve]=a.useState(!1);a.useEffect(()=>{Ve(!0)},[]);const ve=J&&!d&&!p;a.useEffect(()=>{F&&b&&!d&&J&&E.current.pulsate()},[d,b,F,J]);function v(s,ce,ze=g){return H(pe=>(ce&&ce(pe),!ze&&E.current&&E.current[s](pe),!0))}const we=v("start",T),Be=v("stop",_),Pe=v("stop",$),Le=v("stop",I),De=v("stop",s=>{F&&s.preventDefault(),D&&D(s)}),ke=v("start",B),Fe=v("stop",z),Se=v("stop",M),$e=v("stop",s=>{Ce(s),le.current===!1&&X(!1),h&&h(s)},!1),Ne=H(s=>{O.current||(O.current=s.currentTarget),Ee(s),le.current===!0&&(X(!0),N&&N(s)),K&&K(s)}),Q=()=>{const s=O.current;return u&&u!=="button"&&!(s.tagName==="A"&&s.href)},Z=a.useRef(!1),Ie=H(s=>{b&&!Z.current&&F&&E.current&&s.key===" "&&(Z.current=!0,E.current.stop(s,()=>{E.current.start(s)})),s.target===s.currentTarget&&Q()&&s.key===" "&&s.preventDefault(),f&&f(s),s.target===s.currentTarget&&Q()&&s.key==="Enter"&&!p&&(s.preventDefault(),R&&R(s))}),Ue=H(s=>{b&&s.key===" "&&E.current&&F&&!s.defaultPrevented&&(Z.current=!1,E.current.stop(s,()=>{E.current.pulsate(s)})),y&&y(s),R&&s.target===s.currentTarget&&Q()&&s.key===" "&&!s.defaultPrevented&&R(s)});let Y=u;Y==="button"&&(V.href||V.to)&&(Y=w);const j={};Y==="button"?(j.type=k===void 0?"button":k,j.disabled=p):(!V.href&&!V.to&&(j.role="button"),p&&(j["aria-disabled"]=p));const _e=de(i,xe,O),ue=A({},l,{centerRipple:r,component:u,disabled:p,disableRipple:d,disableTouchRipple:g,focusRipple:b,tabIndex:x,focusVisible:F}),Ke=Mt(ue);return Ae(Et,A({as:Y,className:C(Ke.root,c),ownerState:ue,onBlur:$e,onClick:R,onContextMenu:Be,onFocus:Ne,onKeyDown:Ie,onKeyUp:Ue,onMouseDown:we,onMouseLeave:De,onMouseUp:Le,onDragLeave:Pe,onTouchEnd:Fe,onTouchMove:Se,onTouchStart:ke,ref:_e,tabIndex:p?-1:x,type:k},j,V,{children:[o,ve?U(bt,A({ref:Me,center:r},P)):null]}))}),St=Ct;export{St as B,Ze as u};
//# sourceMappingURL=ButtonBase-cb5ed0aa.js.map
