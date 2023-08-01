export default {
  name: 'dashboardHeaderMenu',
  type: 'document',
  title: 'Dashboard Header Menu',
  fields: [
    {
      name: 'links',
      title: 'Nav Links',
      description: 'The links that display in the dashboard navigation',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      name: 'dividerAfter',
      title: 'Insert Divider After',
      description: 'Optionally insert a divider after this link',
      type: 'number',
    },
    {
      name: 'content',
      title: 'Basic Content',
      description: 'Key/value pairs for other content like headers',
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
  ],
}
