import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  // use inline source map when in development
  sourcemap: process.env.NODE_ENV === 'production' ? true : 'inline',
  clean: true,
  target: 'es2023',
  format: ['esm'],
  outDir: 'dist',
  treeshake: true,
  platform: 'node',
  // only minify when building for production
  minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
  ...options,
}));
