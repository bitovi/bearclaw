import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import { deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import { deskStructure } from './desk/structure'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
  name: 'default',
  title: 'BearClaw Studio',

  projectId: 'samchn6r',
  dataset: 'production',

  plugins: [
    deskTool({ structure: deskStructure as any }), 
    visionTool(), 
    ...(isDev ? devOnlyPlugins : [])
  ],

  schema: {
    types: schemaTypes,
  },
})

