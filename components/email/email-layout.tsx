import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { Img } from "@react-email/components";

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

      <Body
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, Helvetica, sans-serif",
          margin: 0,
          padding: "32px 12px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            maxWidth: "560px",
            margin: "0 auto",
            padding: "36px 28px",
          }}
        >
          <Section>
            <Img
              src="https://speakup.cool/iconhd.png"
              alt="SpeakUp"
              width="44"
              height="44"
              style={{
                display: "block",
                marginBottom: "24px",
                borderRadius: "10px",
              }}
            />

            <Heading
              as="h1"
              style={{
                fontSize: "25px",
                lineHeight: "1.35",
                color: "#171717",
                margin: "0 0 18px",
              }}
            >
              {title}
            </Heading>

            {children}
          </Section>

          <Section
            style={{
              borderTop: "1px solid #eeeeee",
              marginTop: "32px",
              paddingTop: "20px",
            }}
          >
            <Text
              style={{
                color: "#737373",
                fontSize: "12px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              SpeakUp — practice speaking, one session at a time.
            </Text>

            <Text
              style={{
                color: "#737373",
                fontSize: "12px",
                marginBottom: 0,
              }}
            >
              <a href="https://speakup.cool" style={{ color: "#525252" }}>
                speakup.cool
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
