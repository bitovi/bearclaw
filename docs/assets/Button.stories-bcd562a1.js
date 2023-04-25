import{j as s}from"./jsx-runtime-1eedc2cd.js";import"./index-2812c619.js";import"./_commonjsHelpers-725317a4.js";const m={primary:"text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600",secondary:"text-blue-800 bg-white hover:bg-blue-50 border"},r=({children:e,variant:u,className:l,...c})=>{const i=`
    flex 
    items-center 
    justify-center 
    rounded-md 
    px-4 
    py-3 
    font-medium 
    ${m[u||"primary"]} 
    ${l||""}
  `;return s("button",{...c,className:i,children:e})};try{r.displayName="Button",r.__docgenInfo={description:"",displayName:"Button",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLButtonElement | null) => void) | RefObject<HTMLButtonElement> | null"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"primary"'},{value:'"secondary"'}]}}}}}catch{}const b={title:"Components/Button",component:r,tags:["component","button"],parameters:{layout:"centered"}},t={render:e=>s(r,{...e,children:"Button"}),args:{variant:"primary"}};var n,a,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: args => <Button {...args}>Button</Button>,
  args: {
    variant: "primary"
  }
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const f=["_Button"];export{t as _Button,f as __namedExportsOrder,b as default};
//# sourceMappingURL=Button.stories-bcd562a1.js.map
