export default {
  name: 'content',
  type: 'document',
	title: 'Content',
  fields: [
    {
      title: 'Content', 
      name: 'content',
      type: 'array', 
      of: [{type: 'block'}]
    }
  ]
}