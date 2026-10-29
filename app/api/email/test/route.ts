import { NextRequest, NextResponse } from "next/server";
import React from "react";
import InactivityReminder from "@/emails/templates/inactivity-reminder";
import { sendEmail } from "@/lib/email/send-email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.EMAIL_TEST_SECRET;
  const recipient = process.env.EMAIL_TEST_TO;

  if (!secret || !recipient) {
    return NextResponse.json(
      { error: "Email test environment variables are missing." },
      { status: 500 }
    );
  }

  if (
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const result = await sendEmail({
      to: recipient,
      subject: "Your SpeakUp email test",
      react: React.createElement(InactivityReminder, {
        name: "there",
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent.",
      id: result?.id,
    });
  } catch (error) {
    console.error("Test email error:", error);

    return NextResponse.json(
      { error: "Unable to send the test email." },
      { status: 500 }
    );
  }
}