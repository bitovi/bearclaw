const commonFields = [
  {
    name: 'name',
    title: 'Name',
    type: 'string',
    validation: (Rule: any) => Rule.required(),
  },
  {
    name: 'label',
    title: 'Label',
    type: 'string',
    description: 'User facing text',
    validation: (Rule: any) => Rule.required(),
  },
  {
    name: 'placeholder',
    title: 'Placeholder',
    type: 'string',
  },
  {
    name: 'required',
    title: 'Required',
    type: 'boolean',
    initialValue: false,
  },
  {
    name: 'disabled',
    title: 'Disabled',
    type: 'boolean',
    initialValue: false,
  },
]

export default {
  name: 'inputField',
  type: 'document',
  title: 'Input Field',
  fields: [
    {
      name: 'questionType',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          {
            title: 'Text',
            value: 'text',
          },
          {title: 'Textarea', value: 'textarea'},
          {title: 'Telephone', value: 'tel'},
          {title: 'Email', value: 'email'},
          {title: 'Select', value: 'select'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'optionList',
      title: 'Option List',
      type: 'array',
      description:
        "If your Question Type is 'Select', you MUST provide at least one item in the Option List",
      of: [
        {
          name: 'selectOption',
          title: 'Select Option',
          type: 'document',
          fields: [
            {
              name: 'value',
              label: 'Value',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'label',
              label: 'Label',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    },
    ...commonFields,
    {
      name: 'pattern',
      title: 'Pattern',
      type: 'string',
      description: 'A value to check against the inputted value at submission',
    },
  ],
}
