
import "dotenv/config";
import React from "react";

import { prisma } from "@/lib/prisma";
import InactivityReminder from "../emails/templates/inactivity-reminder";
import { resend, EMAIL_FROM } from "./resend-client";

const SEND_EMAILS = process.env.SEND_EARLY_USER_EMAILS === "true";
const SUBJECT = "You were here early. Here's what's next.";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        not: "",
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const recipients = users.filter((user) => user.email.trim());

  console.log(`Total recipients: ${recipients.length}`);
  console.log(`Sending enabled: ${SEND_EMAILS}`);

  console.table(
    recipients.map((user) => ({
      email: user.email,
      name: user.name ?? "(no name)",
    }))
  );

  if (!SEND_EMAILS) {
    console.log(
      "\nPreview only. Set SEND_EARLY_USER_EMAILS=true to send."
    );
    return;
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100);

    const result = await resend.batch.send(
      batch.map((user) => ({
        from: EMAIL_FROM,
        to: [user.email],
        subject: SUBJECT,
        react: React.createElement(InactivityReminder, {}),
      }))
    );

    if (result.error) {
      failed += batch.length;
      console.error(
        `Batch starting at recipient ${i + 1} failed:`,
        result.error
      );
      continue;
    }

    sent += batch.length;
    console.log(`Processed ${Math.min(i + 100, recipients.length)} / ${recipients.length}`);
  }

  console.log(`\nCampaign finished. Sent: ${sent}; failed: ${failed}`);
}

main()
  .catch((error) => {
    console.error("Campaign failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
