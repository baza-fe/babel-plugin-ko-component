const rollup = require('rollup').rollup;
const babelrc = require('babelrc-rollup').default;
const babel = require('rollup-plugin-babel');

rollup({
    entry: 'src/index.js',
    plugins: [
        babel(babelrc())
    ],
    external: [
        'babel-template'
    ]
}).then(bundle => {
    bundle.write({
        dest: 'dist/babel-plugin-ko-component.cjs.js',
        format: 'cjs'
    });

    bundle.write({
        dest: 'dist/babel-plugin-ko-component.es.js',
        format: 'es'
    });
}).catch(console.error);
