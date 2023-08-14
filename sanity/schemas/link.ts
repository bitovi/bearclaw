import {icons} from '../../app/components/iconFromString/IconFromString'

export default {
  name: 'link',
  type: 'document',
  title: 'Link',
  fields: [
    {
      name: 'text',
      type: 'string',
      title: 'Link text',
      description: 'The link text as it will appear to the user',
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description: 'Optional: If present, MUI icon will appear to the left of the link text',
      options: {
        list: Object.keys(icons).map((key) => ({title: key, value: key})),
      },
    },
    {
      name: 'ariaLabel',
      type: 'string',
      title: 'ARIA label',
      description: 'Optional: If present, will be read by screen readers instead ot the link text.',
    },
    {
      name: 'to',
      type: 'string',
      title: 'Link to/href',
      description: 'Where the link goes. Can be an internal or external URL. ',
    },
    {
      name: 'newTab',
      type: 'boolean',
      title: 'Open in a new tab?',
      default: false,
    },
    {
      name: 'requiredPermissions',
      title: 'Permissions required to view this link',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'subscriptionView', value: 'subscriptionView'},
          {title: 'subscriptionEdit', value: 'subscriptionEdit'},
          {title: 'subscriptionCreate', value: 'subscriptionCreate'},
          {title: 'orgUsersView', value: 'orgUsersView'},
          {title: 'orgUsersEdit', value: 'orgUsersEdit'},
          {title: 'orgUsersCreate', value: 'orgUsersCreate'},
          {title: 'viewOrgPage', value: 'viewOrgPage'},
        ],
      },
    },
  ],
}
