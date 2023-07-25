import {icons} from '../../app/components/iconFromString/IconFromString'

export default {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    {
      name: 'key',
      type: 'string',
      title: 'Key',
      description: 'Caution: Key used to lookup this content in the code.',
    },
    {
      name: 'breadcrumb',
      type: 'string',
      title: 'Breadcrumb text',
      description: 'How the page will appear in the breadcrumb trail',
    },
    {
      name: 'breadcrumbIcon',
      type: 'string',
      title: 'Breadcrumb Icon',
      description: 'Optional: If present, MUI icon will appear to the left of the breadcrumb text',
      options: {
        list: Object.keys(icons).map((key) => ({title: key, value: key})),
      },
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title text',
      description: 'Browser title text',
    },
    {
      name: 'headline',
      type: 'string',
      title: 'Headline text',
    },
    {
      name: 'subNavLinks',
      title: 'Sub-Navigation Links',
      description:
        'Optional links that display in the sub-navigation on some pages. Changing the order here will change the order in the UI.',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      name: 'inputs',
      type: 'array',
      title: 'Inputs',
      description:
        'Any input fields that might appear on the page, such as a textbox or a dropdown select',
      of: [{type: 'inputField'}],
    },
    {
      name: 'content',
      title: 'Basic Content',
      description: 'Key/value pairs for page content like button text and headers',
      type: 'array',
      of: [
        {
          type: 'document',
          fields: [
            {
              name: 'key',
              type: 'string',
              title: 'Key',
              description: 'The key for the content item',
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'The value for the content item',
            },
          ],
        },
      ],
    },
    {
      name: 'richContent',
      title: 'Rich Content',
      description: 'Rich page content with styles, images, and links',
      type: 'array',
      of: [
        {
          type: 'document',
          fields: [
            {
              name: 'key',
              type: 'string',
              title: 'Key',
              description: 'The key for the content item',
            },
            {
              name: 'value',
              title: 'Value',
              description: 'The value for the content item',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
    },
  ],
}
