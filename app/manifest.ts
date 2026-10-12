import type { MetadataRoute } from "next";
import { DESCRIPTION } from "../lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "ContextBridge", short_name: "ContextBridge", description: DESCRIPTION, start_url: "/", display: "standalone", background_color: "#ece8df", theme_color: "#ece8df", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
