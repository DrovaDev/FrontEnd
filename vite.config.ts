import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
// import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin"; nitroV2Plugin()

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
    build: {
        ssr: false, // explicitly disable SSR
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
