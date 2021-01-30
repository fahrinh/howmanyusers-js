import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'build/module/index.js',
  output: {
    name: 'hmu',
    file: 'dist/module/howmanyusers.js',
    format: 'umd',
  },
  plugins: [
    resolve({ browser: true }),
    commonjs({ requireReturnsDefault: true }),
    globals(),
    builtins({ crypto: true }),
    // terser(),
  ],
};
