import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: `src/index.ts`,
    plugins: [esbuild()],
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        sourcemap: true,
        entryFileNames: '[name].mjs',
        preserveModules: true,
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        interop: 'auto',
        sourcemap: true,
        entryFileNames: '[name].cjs',
        preserveModules: true,
      },
    ]
  },
  {
    input: `src/index.ts`,
    plugins: [dts()],
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        interop: 'auto',
      },
    ]
  }
]