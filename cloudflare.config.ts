import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "my-app",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-24",
    compatibilityFlags: ["nodejs_compat", "nodejs_compat_populate_process_env"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      DATABASE_PROVIDER: bindings.text("neon"),
      DATABASE_URL: bindings.secret(),
    },
  }),
});
