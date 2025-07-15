import "./lib/env";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  build: {
    transpile: ["gsap"],
  },
  css: ["~/assets/css/main.css", "vue-multiselect/dist/vue-multiselect.min.css"],
  app: {
    layoutTransition: {
      name: "layout",
      mode: "out-in", // default
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "nuxt-csurf",
    "nuxt-typed-router",
  ],
  icon: {
    componentName: "NuxtIcon",
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      watch: {
        ignored: ["./.docker/*"],
      },
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  imports: {
    dirs: ["./types/"],
  },
  colorMode: {
    dataValue: "theme",
  },
});
