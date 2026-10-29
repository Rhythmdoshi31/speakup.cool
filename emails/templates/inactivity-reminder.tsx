import {
  Button,
  Text,
} from "@react-email/components";
import EmailLayout from "../../components/email/email-layout";

interface InactivityReminderProps {
  name?: string;
  appUrl?: string;
}

export default function InactivityReminder({
  name,
  appUrl = "https://speakup.cool",
}: InactivityReminderProps) {
  return (
    <EmailLayout
      preview="Your next speaking session is waiting."
      title={
        name
          ? `Ready to speak again, ${name}?`
          : "Ready to speak again?"
      }
    >
      <Text style={paragraph}>
        A little speaking practice goes a long way. Take a few
        minutes today to explore a new topic and put your thoughts
        into words.
      </Text>

      <Text style={paragraph}>
        No preparation needed. Just pick a topic, start speaking,
        and keep improving.
      </Text>

      <Button
        href={appUrl}
        style={{
          backgroundColor: "#ffce42",
          borderRadius: "8px",
          color: "#171717",
          display: "inline-block",
          fontSize: "14px",
          fontWeight: 700,
          padding: "13px 22px",
          textDecoration: "none",
        }}
      >
        Start Speaking
      </Button>
    </EmailLayout>
  );
}

const paragraph = {
  color: "#525252",
  fontSize: "15px",
  lineHeight: "1.8",
  margin: "0 0 18px",
};