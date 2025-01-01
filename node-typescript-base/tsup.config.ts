import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  // use inline source map when in development
  sourcemap: options.watch ? 'inline' : true,
  clean: true,
  target: 'es2023',
  format: ['esm'],
  outDir: 'dist',
  treeshake: true,
  platform: 'node',
  // only minify when building for production
  minify: options.watch ? false : 'terser',
  ...options,
}));
