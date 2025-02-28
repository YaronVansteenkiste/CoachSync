import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "FitTrack",
        short_name: "FitTrack",
        description: "FitTrack is a PWA to track workouts and progress built with Next.js",
        id: "/",
        start_url: "/",
        display: "standalone",
        display_override: ["fullscreen"],
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/icons/icon-x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icons/icon-x512.png",
                type: "image/png",
                sizes: "512x512",
                purpose: "maskable",
            },
        ],
    };
}