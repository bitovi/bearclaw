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
  name: 'questions',
  type: 'document',
  title: 'Questions',
  fields: [
    {
      name: 'questionList',
      title: 'Question List',
      type: 'array',
      of: [
        {
          type: 'document',
          name: 'question',
          title: 'Question',
          fields: [
            {
              name: 'header',
              label: 'Header',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'information',
              label: 'Information',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'questionFields',
              title: 'Account Question Fields',
              type: 'array',
              validation: (Rule: any) =>
                Rule.custom((blocks: any) => {
                  const result = (blocks || []).find(
                    (block: any) =>
                      block.questionType === 'select' &&
                      (!block.optionList || !block.optionList.length)
                  )
                  return result
                    ? `Select questions must have at least one option choice. Fix "${result.name}"`
                    : true
                }),
              of: [
                {
                  name: 'questionField',
                  type: 'document',
                  title: 'Question Field',

                  fields: [
                    {
                      name: 'questionType',
                      type: 'string',
                      options: {
                        list: [
                          {
                            title: 'Text',
                            value: 'text',
                          },
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
                              validation: (Rule: any) => Rule.required(),
                            },
                            {
                              name: 'label',
                              label: 'Label',
                              type: 'string',
                              validation: (Rule: any) => Rule.required(),
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
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
