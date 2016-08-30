import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import test from 'ava';
import { transformFileSync } from 'babel-core';
import plugin from '../';

const fixturesDir = join(__dirname, 'fixtures');

function sanitize(code) {
    return code
        .replace(/^\s+|\s+$/, '')
        .replace(/\r|\n/g, '');
}

readdirSync(fixturesDir).map((caseName) => {
    test(`should ${caseName.split('-').join(' ')}`, (t) => {
        const fixtureDir = join(fixturesDir, caseName);
        const actualPath = join(fixtureDir, 'actual.js');
        const expectedPath = join(fixtureDir, 'expected.js');
        const actual = transformFileSync(actualPath).code;
        const expected = readFileSync(expectedPath).toString();

        t.is(sanitize(actual), sanitize(expected));
    });
});
