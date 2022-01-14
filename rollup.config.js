import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'build/cli.js',
    output: {
        file: 'build/bundle.js',
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        preserveShebangs(),
        resolve(), // tells Rollup how to find dependencies in node_modules
        commonjs(), // converts to ES modules
        // production && terser(), // minify, but only in production,
    ]
};