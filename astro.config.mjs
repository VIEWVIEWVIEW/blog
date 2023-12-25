import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import { loadEnv } from "vite";


const server = function () {
  const {
    VERCEL
  } = loadEnv(import.meta.env, process.cwd(), "");
  if (VERCEL) return vercel();
  return node({
    mode: 'standalone'
  });
};

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: 'https://www.super256.dev',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), solidJs(), mdx()],

  // In case we need a server for debbung purposes, uncomment the following two lines
  // output: 'server',
  // adapter: server(),
  markdown: {
    rehypePlugins: [],
    extendDefaultPlugins: true
  }
});