// @ts-check
import { defineConfig } from "astro/config";

import UnoCSS from "@unocss/astro";

export default defineConfig({
  base: "/themes/astro-pure-halo",
  build: {
    assets: "assets",
    format: "file",
  },
  outDir: "./templates",
  integrations: [UnoCSS({ injectReset: true })],
  scopedStyleStrategy: "where",
});
