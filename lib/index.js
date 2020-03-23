'use strict';

const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

exports.request = require('./request');

exports.load = async () => {

    const iter = [];
    const data = {
        stat_meta: require('./statMeta'),
        stat_figures: require('./statFigures'),
        stat_trend: require('./statTrend'),
        stat_agegroup: require('./statAgeGroup'),
        case_foreigner: require('./caseForeigner'),
        case_overseas: require('./caseForeigner'),
        case_profiles: require('./caseProfiles'),
        case_hospitals: require('./caseHospitals'),
        case_residences: require('./caseResidences')
    };

    for (const group in data) {
        if (Object.prototype.hasOwnProperty.call(data, group)) {
            iter.push((async () => {

                data[group] = await data[group]();
            })());
        }
    }

    await Promise.all(iter);

    return data;
};

exports.save = async (filename) => {

    const data = await exports.load();
    await writeFile(filename, JSON.stringify(data));
};
