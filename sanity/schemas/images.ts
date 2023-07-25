export default {
  name: 'images',
  title: 'Images',
  description: 'Image content for page.',
  type: 'array',
  of: [
    {
      type: 'image',
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          validation: (Rule: any) => Rule.required(),
          description: 'Required Alt text for image',
          type: 'string',
        },
        {
          name: 'name',
          title: 'Name',
          validation: (Rule: any) => Rule.required(),
          type: 'string',
        },
        {
          name: 'hidden',
          title: 'Hidden',
          type: 'boolean',
          initialValue: false,
        },
      ],
      title: 'Value',
      description: 'An Image to display on the selected screen sidebar',
      initialValue: {
        location: 'onboarding',
      },
    },
  ],
}
