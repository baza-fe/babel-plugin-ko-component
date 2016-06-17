const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
    entry: 'src/index.js',
    plugins: [
        babel()
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
        dest: 'dist/babel-plugin-ko-component.es6.js',
        format: 'es6'
    });
}).catch(console.error);
