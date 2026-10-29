import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/* Dev only: the edit bar on content pages posts edited copy here and it is
   written straight back into src/content/<name>.json.                      */
function contentEditor(): Plugin {
  const root = path.dirname(fileURLToPath(import.meta.url));
  return {
    name: "content-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || !req.url?.startsWith("/__content/")) {
          return next();
        }
        const name = req.url.slice("/__content/".length).replace(/[^\w-]/g, "");
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            writeFileSync(
              path.join(root, "src/content", `${name}.json`),
              JSON.stringify(data, null, 2) + "\n",
            );
            res.statusCode = 200;
            res.end("ok");
          } catch (err) {
            res.statusCode = 400;
            res.end(String(err));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), contentEditor()],
});
