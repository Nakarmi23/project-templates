import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  splitting: false,
  format: 'esm',
  sourcemap: true,
  clean: true,
  minify: !options.watch ? 'terser' : false,
}));
