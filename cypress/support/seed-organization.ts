/**
 * Use this to generate a user with an organization and seed that org with a provided number of members
 */
import { installGlobals } from "@remix-run/node";
import { parse } from "cookie";

import { createUser } from "~/models/user.server";
import { addOrganizationUser } from "~/models/organizationUsers.server";
import { createUserSession } from "~/session.server";
import { faker } from "@faker-js/faker";
import { prisma } from "~/db.server";

installGlobals();

function createLoginData() {
  return {
    email: `${faker.internet.userName()}-@example.com`,
    password: faker.internet.password(),
    resetPassword: faker.internet.password(),
  };
}

async function seedOrganization(ownerEmail: string, memberCount = "0") {
  if (!ownerEmail) {
    throw new Error("email required for login");
  }
  if (!ownerEmail.endsWith("@bigbear.ai")) {
    throw new Error("All test emails must end in @bigbear.ai");
  }

  const { user, orgId: organizationId } = await createUser(
    ownerEmail,
    "myreallystrongpassword"
  );

  if (!organizationId) {
    throw new Error("OrgId missing from seed organization response");
  }

  const response = await createUserSession({
    request: new Request("test://test"),
    userId: user.id,
    orgId: organizationId,
    mfaEnabled: false,
    remember: false,
    redirectTo: "/dashboard",
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim()
  );

  let count = 0;
  while (count < parseInt(memberCount)) {
    const credentials = createLoginData();
    const { id: userId } = await prisma.user.create({
      data: {
        email: credentials.email,
        password: {
          create: {
            hash: credentials.password,
          },
        },
      },
    });

    await addOrganizationUser(userId, organizationId);
    count++;
  }
}

seedOrganization(process.argv[2], process.argv[3]);
