import type { StructureBuilder, StructureContext } from "sanity/desk";

export function deskStructure(S: StructureBuilder, ctx: StructureContext ) {

  return S.list()
    .title('App')
    .items([
      S.listItem()
        .title('Authentication')
        .child(
          S.list()
            .title('Sections')
            .items([
              S.listItem()
                .title('Forms')
                .child(
                  S.editor()
                  .title('Forms')
                  .schemaType('authForm')
                    .documentId('authForm')
              ),
              S.listItem()
                .title('Sidebar')
                .child(
                  S.editor()
                  .title('Sidebar')
                  .schemaType('content')
                    .documentId('authSidebar')
              ),
            ])
      ),
      S.listItem()
        .title('Dashboard Controls')
        .child(
          S.list()
            .title('Controls')
            .items([
              S.listItem()
                .title('Navigation')
                .child(
                  S.editor()
                  .title('Navigation')
                  .schemaType('dashboardSideNav')
                    .documentId('dashboardSideNav')
              ),
            ])
      ),
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              ...S.documentTypeListItems()
              .filter(listItem => ![
                'authForm',
                'dashboardSideNav',
              ].includes(`${listItem.getId()}`))
            ])
        )
    ])
}