import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
// import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin"; nitroV2Plugin()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Server-only (no VITE_ prefix, so it never reaches the browser bundle), e.g.
    // DROVA_API_URL=https://api.example.com/api/v1 in .env.local.
    const apiUrl = loadEnv(mode, process.cwd(), "").DROVA_API_URL;
    const api = apiUrl ? new URL(apiUrl) : null;

    return {
        plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
        build: {
            ssr: false, // explicitly disable SSR
        },
        server: {
            // Dev mirror of the vercel.json rewrite: only public order tracking reaches the API.
            proxy: api
                ? {
                      "/api/v1/order/track": {
                          target: api.origin,
                          changeOrigin: true,
                          rewrite: (path) => path.replace(/^\/api\/v1/, api.pathname.replace(/\/+$/, "")),
                      },
                  }
                : undefined,
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
    };
});
