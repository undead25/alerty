import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: './src/alerty.ts',
  format: 'cjs',
  dest: './lib/alerty.js',
  sourceMap: true,
  plugins: [
    typescript(),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}