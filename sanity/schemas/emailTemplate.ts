export default {
  name: 'emailTemplate',
  type: 'document',
  title: 'Page',
  fields: [
    {
      name: 'key',
      type: 'string',
      title: 'Key',
      description: 'Caution: Key used to lookup this template in the code.',
    },
    {
      name: 'subject',
      type: 'string',
      title: 'Subject',
      description: 'Email subject line',
    },
    {
      name: 'body',
      title: 'Body',
      description:
        "Rich page content with styles, images, and links. Be gentle, fancy emails don't work everywhere.",
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
