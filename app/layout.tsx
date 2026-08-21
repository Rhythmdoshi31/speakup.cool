import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Mulish } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://speakup.cool"),

  title: {
    default: "SpeakUp — Think. Speak. Convince.",
    template: "%s | SpeakUp",
  },

  description:
    "Practice speaking on random topics, debate both sides of an argument, explore deep research questions, and sharpen your ability to think on your feet.",

  applicationName: "SpeakUp",

  authors: [
    {
      name: "Rhythm Doshi",
      url: "https://rhythmdoshi.xyz",
    },
  ],

  creator: "Rhythm Doshi",

  keywords: [
    "public speaking",
    "speaking practice",
    "debate practice",
    "impromptu speaking",
    "speech practice",
    "random speaking topics",
    "debate topics",
    "communication skills",
    "critical thinking",
    "deep research",
    "persuasion",
  ],

  alternates: {
    canonical: "https://speakup.cool",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },

  openGraph: {
    type: "website",
    url: "https://speakup.cool",
    siteName: "SpeakUp",

    title: "SpeakUp — Think. Speak. Convince.",

    description:
      "Practice speaking on random topics, debate both sides of an argument, explore deep research questions, and sharpen your ability to think on your feet.",

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SpeakUp — Think. Speak. Convince.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "SpeakUp — Think. Speak. Convince.",

    description:
      "Random topics. Timed speeches. Debates. Deep research. See what you can say.",

    images: ["/twitter-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
