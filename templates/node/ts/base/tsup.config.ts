import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  splitting: false,
  format: 'esm',
  tsconfig: 'tsconfig.json',
  sourcemap: true,
  clean: true,
  minify: !options.watch ? 'terser' : false,
}));
