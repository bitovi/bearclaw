import{a as C,j as n}from"./jsx-runtime-1eedc2cd.js";import"./index-2812c619.js";import"./_commonjsHelpers-725317a4.js";const s=({children:a,inputClasses:p,containerClasses:u,labelClasses:c,name:e,verticalLabel:r=!1,...d})=>{const m=`
    border
    ${p||""}
    `,f=`
    ${r?"flex-row":""}
    ${u||""}
    `,x=`
    ${r?"flex":"px-2"}
    ${c||""}
    `;return C("div",{className:f,children:[n("label",{className:x,htmlFor:e,children:e}),n("input",{id:e,name:e,type:"text",className:m,...d})]})};try{s.displayName="TextInput",s.__docgenInfo={description:"",displayName:"TextInput",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLInputElement | null) => void) | RefObject<HTMLInputElement> | null"}},inputClasses:{defaultValue:null,description:"",name:"inputClasses",required:!1,type:{name:"string"}},containerClasses:{defaultValue:null,description:"",name:"containerClasses",required:!1,type:{name:"string"}},labelClasses:{defaultValue:null,description:"",name:"labelClasses",required:!1,type:{name:"string"}},verticalLabel:{defaultValue:{value:"false"},description:"",name:"verticalLabel",required:!1,type:{name:"boolean"}}}}}catch{}const g={title:"Components/Input/Text",component:s,tags:["component","input","text-input"],parameters:{layout:"centered"},args:{name:"Text Box",verticalLabel:!1}},t={render:a=>n(s,{...a})};var l,o,i;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    return <TextInput {...args} />;
  }
}`,...(i=(o=t.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};const I=["_TextInput"];export{t as _TextInput,I as __namedExportsOrder,g as default};
//# sourceMappingURL=TextInput.stories-f1bfe80b.js.map
