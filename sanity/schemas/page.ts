export default {
  name: 'page',
  type: 'document',
	title: 'Page',
  fields: [
    {
      name: 'key',
      type: 'string',
      title: 'Key',
      description: 'Caution: Key used to lookup this content in the code.'
    },
    {
      name: 'breadcrumb',
      type: 'string',
      title: 'Breadcrumb text',
      description: 'How the page will appear in the breadcrumb trail'
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title text',
      description: 'Browser title text'
    },
    {
      name: 'headline',
      type: 'string',
      title: 'Headline text',
    },
    {
      name: 'subNavLinks',
      title: 'Sub-Navigation Links',
      description: 'The links that display in the page sub-navigation. Changing the order here will change the order in the UI.',
      type: 'array',
      of: [ {type: 'link'} ]
    },
    {
      name: 'content',
      title: 'Basic Content',
      description: 'Key/value pairs for page content like button text and headers',
      type: 'array',
      of: [ {
        type: 'document',
        fields: [
          {
            name: 'key',
            type: 'string',
            title: 'Key',
            description: 'The key for the content item'
          },
          {
            name: 'value',
            type: 'string',
            title: 'Value',
            description: 'The value for the content item'

          }
        ],
      }],
    },
    {
      name: 'richContent',
      title: 'Rich Content',
      description: 'Rich page content with styles, images, and links',
      type: 'array',
      of: [ {
        type: 'document',
        fields: [
          {
            name: 'key',
            type: 'string',
            title: 'Key',
            description: 'The key for the content item'
          },
          {
            name: 'value',
            title: 'Value',
            description: 'The value for the content item',
            type: 'array', 
            of: [{type: 'block'}]
          }
        ],
      }],
    },
  ]
}