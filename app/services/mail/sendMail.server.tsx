import { prisma } from "~/db.server";
import type { EmailType } from "./types";
import nodemailer from "nodemailer";
let aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");

export async function sendMail(email: EmailType, fake = false) {
  console.log("sendMail", email, fake);
  if (fake) return;

  if (process.env.EMAIL_USE_DEV) {
    return await sendFakeMail(email);
  } else {
    return sendSesMail(email);
  }
}

export async function sendFakeMail(email: EmailType) {
  return prisma.fakeEmail.create({
    data: {
      from: email.from || process.env.EMAIL_FROM || "system",
      ...email,
    },
  });
}

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
  defaultProvider,
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

function sendSesMail(email: EmailType) {
  transporter.sendMail(
    {
      from: email.from || process.env.EMAIL_FROM,
      replyTo: email.replyTo,
      to: email.to,
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
