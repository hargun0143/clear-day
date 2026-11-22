import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

function aqiDevServerPlugin(mode: string): Plugin {
  return {
    name: "aqi-dev-server",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      if (env.DATA_GOV_IN_API_KEY) {
        process.env.DATA_GOV_IN_API_KEY = env.DATA_GOV_IN_API_KEY;
      }

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "", "http://localhost");
        if (url.pathname === "/api/aqi") {
          try {
            const { default: handler } = await import("./api/aqi.js");
            await handler(req, res);
          } catch (err) {
            next(err);
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), aqiDevServerPlugin(mode)],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
}));
