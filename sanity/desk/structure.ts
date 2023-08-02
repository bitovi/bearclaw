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
                .child(
                  S.list()
                    .title('Content')
                    .items([
                      S.listItem()
                        .title('Image Content')
                        .child(
                          S.editor()
                            .title('Images')
                            .schemaType('sidebarImages')
                            .documentId('sidebarImages')
                        ),
                      S.listItem()
                        .title('Rich Content')
                        .child(
                          S.editor()
                            .title('Rich Content')
                            .schemaType('content')
                            .documentId('authSidebar')
                        ),
                    ])
                ),
              S.listItem()
                .title('Questions')
                .child(
                  S.list()
                    .title('Sections')
                    .items([
                      S.listItem()
                        .title('Account')
                        .child(
                          S.editor()
                            .title('Account Questions')
                            .schemaType('questions')
                            .documentId('accountQuestions')
                        ),
                      S.listItem()
                        .title('Onboarding')
                        .child(
                          S.editor()
                            .title('Onboarding Questions')
                            .schemaType('questions')
                            .documentId('onboardingQuestions')
                        ),
                    ])
                ),
            ])
        ),
      S.listItem()
        .title('Dashboard')
        .child(
          S.list()
            .title('Dashboard')
            .items([
              S.listItem()
                .title('Header Menu')
                .child(
                  S.editor()
                    .title('Navigation')
                    .schemaType('dashboardSideNav')
                    .documentId('dashboardHeaderNav')
                ),
              S.listItem()
                .title('Side Navigation')
                .child(
                  S.editor()
                    .title('Side Navigation')
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
