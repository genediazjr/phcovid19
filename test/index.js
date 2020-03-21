'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Lib = require('..');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('lib', () => {

    it('loads', async () => {

        const data = await Lib.load();
        expect(data.stat_meta).exist();
        expect(data.stat_figures).exist();
        expect(data.stat_trend).exist();
        expect(data.stat_agegroup).exist();
        expect(data.case_foreigner).exist();
        expect(data.case_overseas).exist();
        expect(data.case_profiles).exist();
        expect(data.case_hospitals).exist();
        expect(data.case_residences).exist();
    });
});
