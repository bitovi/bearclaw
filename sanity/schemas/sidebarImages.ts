export default {
  name: 'sidebarImages',
  type: 'document',
  title: 'Sidebar Images',
  fields: [
    {
      name: 'imageContent',
      title: 'Image Content',
      description: 'Image content for sidebar.',
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
              name: 'location',
              title: 'Location',
              description: 'Which sidebar to dispaly image on',
              type: 'string',
              options: {
                list: [
                  {
                    title: 'Onboarding',
                    value: 'onboarding',
                  },
                  {title: 'Auth', value: 'auth'},
                ],
                layout: 'radio',
              },
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
    },
  ],
}
