import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'umd';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread'
    ],
    babelrc: false
};

const dest = {
    amd:  `dist/amd/router5-persistent-params.js`,
    umd:  `dist/umd/router5-persistent-params.js`
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions) ],
    moduleName: 'router5PersistentParamsPlugin',
    moduleId: 'router5PersistentParamsPlugin',
    dest
};
