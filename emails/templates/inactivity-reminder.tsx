
import { Button, Text, Section } from "@react-email/components";
import EmailLayout from "../../components/email/email-layout";

interface EarlyUserUpdateProps {
  appUrl?: string;
}

export default function EarlyUserUpdate({
  appUrl = "https://speakup.cool/",
}: EarlyUserUpdateProps) {
  return (
    <EmailLayout
      preview="A quick update from SpeakUp."
      title=""
    >
      <Text style={styles.paragraph}>Hey there,</Text>

      <Text style={styles.paragraph}>
        Hope you&apos;re enjoying SpeakUp!
      </Text>

      <Text style={styles.paragraph}>
        We built SpeakUp with a simple idea:{" "}
        <strong>
          everyone should have the confidence to express their
          thoughts, one conversation at a time.
        </strong>
      </Text>

      <Text style={styles.paragraph}>
        And that journey starts with showing up.
      </Text>

      <Text style={styles.paragraph}>
        Here&apos;s your little reminder to come back, pick a topic,
        and speak your mind. Build that streak, challenge yourself
        to speak about something new, and see how much more
        confidently you can express yourself over time.
      </Text>

      <Text style={styles.paragraph}>
        <strong>And this is just the beginning.</strong>
      </Text>

      <Text style={styles.paragraph}>
        We&apos;re working on some exciting things for SpeakUp,
        including premium AI-powered features that will
        help you understand your speaking patterns and discover
        where you can improve.
      </Text>

      <Text style={styles.paragraph}>
        There&apos;s a lot more in the works, and we can&apos;t wait
        to share it with you.
      </Text>

      <Text style={styles.paragraph}>
        <strong>
          One more thing — you&apos;re here early, and that means a
          lot to us. ❤️
        </strong>
      </Text>

      <Text style={styles.paragraph}>
        As we grow, we want our early users to be part of the
        journey. We&apos;re planning to give you free access to many
        of our upcoming features, so you can experience what
        SpeakUp becomes without having to pay for everything
        we build.
      </Text>

      <Text style={styles.paragraph}>
        For now, keep showing up, keep speaking, and keep
        building that streak. Your future self will thank you.
      </Text>

      <Text style={styles.paragraph}>
        Thanks for being part of SpeakUp so early. We&apos;re only
        getting started, and we&apos;re glad you&apos;re here.
      </Text>

      <Text style={styles.paragraph}>
        See you on the next spin!
      </Text>

      <Section style={styles.buttonSection}>
        <Button href={appUrl} style={styles.button}>
          Start Speaking
        </Button>
      </Section>

      <Text style={styles.signature}>Team SpeakUp</Text>

      <Text style={styles.link}>
        <a href="https://speakup.cool/" style={styles.link}>
          speakup.cool
        </a>
      </Text>
    </EmailLayout>
  );
}

const styles = {
  paragraph: {
    color: "#333333",
    fontSize: "14px",
    lineHeight: "1.8",
    margin: "0 0 18px",
  },
  buttonSection: {
    margin: "28px 0",
  },
  button: {
    backgroundColor: "#222222",
    borderRadius: "5px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 20px",
    textDecoration: "none",
  },
  signature: {
    color: "#222222",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 8px",
  },
  link: {
    color: "#333333",
    fontSize: "14px",
    textDecoration: "none",
  },
};
