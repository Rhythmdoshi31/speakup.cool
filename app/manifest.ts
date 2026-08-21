import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SpeakUp",
    short_name: "SpeakUp",
    description:
      "Practice speaking, debate ideas, and think on your feet.",
    start_url: "/",
    display: "standalone",
    background_color: "#092634",
    theme_color: "#092634",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}