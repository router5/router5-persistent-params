import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { argv } from 'yargs';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread'
    ],
    babelrc: false
};

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const dest = {
    amd:  `dist/amd/router5-persistent-params${ compress ? '.min' : '' }.js`,
    umd:  `dist/umd/router5-persistent-params${ compress ? '.min' : '' }.js`,
    iife: `dist/browser/router5-persistent-params${ compress ? '.min' : '' }.js`
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions) ].concat(compress ? uglify() : []),
    moduleName: 'router5PersistentParamsPlugin',
    moduleId: 'router5PersistentParamsPlugin',
    dest
};
