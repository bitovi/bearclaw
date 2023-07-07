import type {StructureBuilder, StructureContext} from 'sanity/desk'

export function deskStructure(S: StructureBuilder, ctx: StructureContext) {
  return S.list()
    .title('App Content')
    .items([
      S.listItem()
        .title('Authentication')
        .child(
          S.list()
            .title('Sections')
            .items([
              S.listItem()
                .title('Forms')
                .child(S.editor().title('Forms').schemaType('authForm').documentId('authForm')),
              S.listItem()
                .title('Sidebar')
                .child(S.editor().title('Sidebar').schemaType('content').documentId('authSidebar')),
            ])
        ),
      S.listItem()
        .title('Dashboard')
        .child(
          S.list()
            .title('Dashboard')
            .items([
              S.listItem()
                .title('Navigation')
                .child(
                  S.editor()
                    .title('Navigation')
                    .schemaType('dashboardSideNav')
                    .documentId('dashboardSideNav')
                ),
              S.listItem()
                .title('Pages')
                .child(S.documentList().title('Pages').filter('_type == "page"')),
            ])
        ),
    ])
}
