import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false, // This is necessary for the MongoDB tests to work, as all of them use the mongoose library, which is not compatible with file parallelism.
  },
});
