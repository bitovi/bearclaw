import{a as b,j as n}from"./jsx-runtime-1eedc2cd.js";import"./index-2812c619.js";import"./_commonjsHelpers-725317a4.js";const a=({children:s,inputClasses:p,containerClasses:u,label:c,labelClasses:d,name:e,verticalLabel:l=!1,...m})=>{const f=`
    border
    ${p||""}
    `,x=`
    ${l?"flex-row":""}
    ${u||""}
    `,C=`
    ${l?"flex":"px-2"}
    ${d||""}
    `;return b("div",{className:x,children:[n("label",{className:C,htmlFor:e,children:c||e}),n("input",{id:e,name:e,type:"text",className:f,...m})]})};try{a.displayName="TextInput",a.__docgenInfo={description:"",displayName:"TextInput",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLInputElement | null) => void) | RefObject<HTMLInputElement> | null"}},inputClasses:{defaultValue:null,description:"",name:"inputClasses",required:!1,type:{name:"string"}},containerClasses:{defaultValue:null,description:"",name:"containerClasses",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},labelClasses:{defaultValue:null,description:"",name:"labelClasses",required:!1,type:{name:"string"}},verticalLabel:{defaultValue:{value:"false"},description:"",name:"verticalLabel",required:!1,type:{name:"boolean"}}}}}catch{}const I={title:"Components/Input/Text",component:a,tags:["component","input","text-input"],parameters:{layout:"centered"},args:{name:"Text Box",verticalLabel:!1}},t={render:s=>n(a,{...s})};var r,i,o;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => {
    return <TextInput {...args} />;
  }
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};const T=["_TextInput"];export{t as _TextInput,T as __namedExportsOrder,I as default};
//# sourceMappingURL=TextInput.stories-b548c68e.js.map
