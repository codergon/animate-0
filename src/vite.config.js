export default {
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  envDir: "../",

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import", "legacy-js-api", "global-builtin"],
      },
    },
  },
};
