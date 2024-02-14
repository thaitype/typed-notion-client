import { defineConfig } from 'tsup';

export default defineConfig({
  /**
   * Inject cjs and esm shims
   *
   * Enabling this option will fill in some code when building esm/cjs to make it work,
   * such as `__dirname` which is only available in the cjs module and `import.meta.url` which is only available in the esm module
   *
   * Ref: https://tsup.egoist.dev/#inject-cjs-and-esm-shims
   */
  shims: true,
});
