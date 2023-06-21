export default {
  name: 'dashboardSideNav',
  type: 'document',
	title: 'Dashboard Side Nav',
  fields: [
    {
      name: 'links',
      title: 'Nav Links',
      description: 'The links that display in the dashboard navigation',
      type: 'array',
      of: [ {type: 'link'} ]
    },
    {
      name: 'dividerAfter',
      title: 'Insert Divider After',
      description: 'Optionally insert a divider after this link',
      type: 'number',
    },
  ]
}