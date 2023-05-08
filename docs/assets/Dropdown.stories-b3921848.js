import{a as h,j as o}from"./jsx-runtime-1eedc2cd.js";import"./index-2812c619.js";import"./_commonjsHelpers-725317a4.js";const i=({name:e,label:a,options:l=[],containerClasses:s,labelClasses:u,selectClasses:m,optionClasses:f,verticalLabel:n=!1,...C})=>{const b=`
    ${n?"flex-row":""}
    ${s||""}
  `,y=`
    ${n?"flex":"px-2"}
    ${u||""}
  `,g=`
    border
    ${n?"justify-self-center w-full":""}
    ${m||""}
  `,_=`
    text-center
    ${f||""}
  `;return h("div",{className:b,children:[o("label",{htmlFor:`${e}-select`,className:y,children:a||e}),o("select",{name:e,id:`${e}-select`,...C,className:g,children:l.map(({label:$,...r},w)=>o("option",{className:_,...r,children:$||r.value},`${r.value}-${w}`))})]})};try{i.displayName="Dropdown",i.__docgenInfo={description:"",displayName:"Dropdown",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},options:{defaultValue:{value:"[]"},description:"",name:"options",required:!1,type:{name:"OptionHTMLAttributes<HTMLOptionElement>[]"}},containerClasses:{defaultValue:null,description:"",name:"containerClasses",required:!1,type:{name:"string"}},labelClasses:{defaultValue:null,description:"",name:"labelClasses",required:!1,type:{name:"string"}},selectClasses:{defaultValue:null,description:"",name:"selectClasses",required:!1,type:{name:"string"}},optionClasses:{defaultValue:null,description:"",name:"optionClasses",required:!1,type:{name:"string"}},verticalLabel:{defaultValue:{value:"false"},description:"",name:"verticalLabel",required:!1,type:{name:"boolean"}}}}}catch{}const D={title:"Components/Dropdown",component:i,tags:["component","dropdown"],parameters:{layout:"centered"}},v=e=>{const a=[{value:0,label:"Placeholder value"}];let l="";for(let s=0;s<=e;s++)l+="*",a.push({value:s,label:l});return a},t={args:{options:v(20)}};var c,p,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    options: optGenerator(20)
  }
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const N=["_Dropdown"];export{t as _Dropdown,N as __namedExportsOrder,D as default};
//# sourceMappingURL=Dropdown.stories-b3921848.js.map
