'use strict';

const qs = require('querystring');
const req = require('./request');
const util = require('./util');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/OF_masterlist/FeatureServer/0/query';
const params = {
    f: 'json',
    where: '1=1',
    orderByFields: 'num desc',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '102100',
    outFields: '*',
    resultOffset: '0',
    resultRecordCount: '10000000',
    returnGeometry: 'false',
    cacheHint: true
};

module.exports = async () => {

    const data = {
        list: [],
        stat: {
            total: 0,
            sex: { male: 0, female: 0 },
            ageGroup: {},
            ageGroupSex: {},
            country: {}
        }
    };

    const res = await req(`${ path }?${ qs.stringify(params) }`);

    for (let i = 0; i < res.features.length; ++i) {
        let feature = res.features[i].attributes;
        feature = util.assign({
            id: '',
            row: '',
            code: '',
            date_reported: '',
            date_confined: '',
            age: '',
            sex: '',
            status: '',
            remarks: '',
            country: '',
            longitude: '',
            latitude: ''
        }, {
            id: feature.FID,
            row: feature.num,
            code: feature.Case_numbe,
            date_reported: feature.date_repor,
            date_confined: feature.date_confi,
            age: feature.age,
            sex: feature.sex.toLowerCase(),
            status: feature.status,
            remarks: feature.remarks,
            country: feature.country,
            longitude: feature.longitude,
            latitude: feature.latitude
        });

        data.stat.total += 1;

        util.setAgeGroup(feature, data);
        util.increment(feature.sex, data.stat.sex);

        if (feature.country) {
            if (!data.stat.country[feature.country]) {
                data.stat.country[feature.country] = 0;
            }

            data.stat.country[feature.country] += 1;
        }

        data.list.push(feature);
    }

    data.stat.ageGroup = util.orderKeys(data.stat.ageGroup);
    data.stat.ageGroupSex = util.orderKeys(data.stat.ageGroupSex);
    data.stat.country = util.orderKeys(data.stat.country);

    return data;
};
