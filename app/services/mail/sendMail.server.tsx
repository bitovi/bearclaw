import { prisma } from "~/db.server";
import type { EmailType } from "./types";
import nodemailer from "nodemailer";
let aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");

export async function sendMail(email: EmailType, fake = false) {
  if (fake) return;

  if (process.env.NODE_ENV === "development") {
    return await sendFakeMail(email);
  } else {
    return await sendSesMail(email);
  }
}

export async function sendFakeMail(email: EmailType) {
  return prisma.fakeEmail.create({
    data: email,
  });
}

// iam user name: ses-smtp-user.ryan.vbt
// smtp user name: AKIASRQXOXHXQUFN63XE
// smpt password: BHtDckAWdNxiSsNupDlHfnA8s5WE0PLjzaQ5Ep6Xdlm6

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
  defaultProvider,
});
// const ses = new aws.SES({
//   apiVersion: "2010-12-01",
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: "AKIASRQXOXHXQUFN63XE",
//     secretAccessKey: "BHtDckAWdNxiSsNupDlHfnA8s5WE0PLjzaQ5Ep6Xdlm6",
//   },
// });

// const transporter = nodemailer.createTransport({
//   pool: true,
//   host: "smtp.example.com",
//   port: 465,
//   secure: true, // use TLS
//   auth: {
//     user: process.env.AWS_ACCESS_KEY_ID,
//     pass: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

function sendSesMail(email: EmailType) {
  transporter.sendMail(
    {
      from: email.from,
      to: email.to,
      replyTo: email.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.messageId);
      }
    }
  );
}
