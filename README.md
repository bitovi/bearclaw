# BearClaw UI

Browser-based UI to interact with the BearClaw software analysis tool.

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

### Docker

The dev environment needs Postgres to match production and its just easier to set all that up with a Docker container so you just need to install Docker and teh rest can be magic.

Download and install [Docker](https://www.docker.com/). The recommended settings should be fine.

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode with hot module reload, rebuilding assets on file changes.

### Language: Typescript

[Typescript Docs](https://www.typescriptlang.org/docs/)

This project is built in Typescript, which should make it easier to deal with the complex data models produced by the BearClaw system.

### Framework: Remix

Remix is a full-stack framework from the creator of React Router. Remix advantages:

- Fast and SEO-friendly server-side rendering of page content.
- Backend-for-frontend (BFF) architecture means Remix can orchestrate and combine BearClaw requests into a single interaction with the browser and eliminate React request-waterfall delays.
- Code is only sent to the browser if the user has access to use that code, reducing the ability to reverse-engineer the application.

### Database: Prisma ORM

This project uses Prisma to manage and interact with the database. Use migrations to make changes to the database and Prisma will setup type-safe interfaces to access the data.

[Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/get-started)

### Styling: TBD

[Tailwind](https://tailwindcss.com/docs/) for now

### Automation: Husky

[Husky Docs](https://typicode.github.io/husky/#/)

Husky hooks can add automated checks to various development steps. Currently, validation (lint, test, etc) will run when creating a commit. If the validation step fails, the commit will be blocked.

## Deployment

### Setup

This setup is complete and should not need to be done again, unless a new hosting environment is selected.

GitHub Actions handle automatically deploying to production and staging environments.

> **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create bearclaw
  fly apps create bearclaw-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app bearclaw
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app bearclaw-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app bearclaw
  fly volumes create data --size 1 --app bearclaw-staging
  ```

### Automatic deployments

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

Starting with a simple SQLite database, at least until final deployment location is determined. SQLite is lightweight and stores data in a file inside the deployment. The file lives at `/data/sqlite.db`. You can connect to the live database by running `fly ssh console -C database-cli`.

Production will probably switch to Postgres, but that is not determined nor setup yet.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
