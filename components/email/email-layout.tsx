import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  title: string;
  children: ReactNode;
}

export default function EmailLayout({
  preview,
  title,
  children,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section
            style={{
              marginBottom: "32px",
            }}
          >
            <table
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ borderCollapse: "collapse" }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      verticalAlign: "middle",
                      paddingRight: "8px",
                    }}
                  >
                    <Img
                      src="https://speakup.cool/icon.png"
                      alt="SpeakUp"
                      width="24"
                      height="24"
                      style={{
                        display: "block",
                        width: "24px",
                        height: "24px",
                        objectFit: "contain",
                      }}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <Text
                      style={{
                        margin: 0,
                        color: "#222222",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "24px",
                      }}
                    >
                      SpeakUp
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Heading as="h1" style={styles.heading}>
            {title}
          </Heading>

          {children}

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              SpeakUp · Practice speaking, one session at a time.
            </Text>
            <Text style={styles.footerText}>
              <a href="https://speakup.cool" style={styles.footerLink}>
                speakup.cool
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#ffffff",
    color: "#222222",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: "0 auto",
    padding: "24px 16px",
  },
  container: {
    maxWidth: "520px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "36px",
  },
  logo: {
    display: "inline-block",
    objectFit: "contain" as const,
    marginRight: "8px",
  },
  brand: {
    display: "inline-block",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0",
  },
  heading: {
    color: "#222222",
    fontSize: "25px",
    fontWeight: "600",
    lineHeight: "1.35",
    letterSpacing: "-0.5px",
    margin: "0 0 24px",
  },
  footer: {
    borderTop: "1px solid #eeeeee",
    marginTop: "36px",
    paddingTop: "16px",
  },
  footerText: {
    color: "#888888",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "4px 0",
  },
  footerLink: {
    color: "#666666",
    textDecoration: "none",
  },
};
