const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');

rollup({
    entry: 'src/index.js',
    plugins: [
        buble()
    ],
    external: [
        'babel-template'
    ]
}).then(bundle => {
    bundle.write({
        dest: 'dest/babel-plugin-ko-component.js',
        format: 'cjs'
    });
}).catch(console.error);
