'use strict';

const qs = require('querystring');
const req = require('./request');
const util = require('./util');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/FN_masterlist/FeatureServer/0/query';
const params = {
    f: 'json',
    where: '1=1',
    orderByFields: 'FID desc',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '102100',
    outFields: '*',
    resultOffset: 0,
    resultRecordCount: 1000,
    returnGeometry: 'false'
};

module.exports = async () => {

    params.resultOffset = 0;

    const data = {
        list: [],
        stat: {
            total: 0,
            sex: { male: 0, female: 0 },
            ageGroup: {},
            ageGroupSex: {},
            nationality: {},
            travel_end: {},
            travel_history: {}
        }
    };

    let res;
    do {
        res = await req(`${ path }?${ qs.stringify(params) }`);

        for (let i = 0; i < res.features.length; ++i) {
            let feature = res.features[i].attributes;
            feature = util.assign({
                id: '',
                code: '',
                age: '',
                sex: '',
                status: '',
                confirmed_date: '',
                nationality: '',
                travel_date: '',
                travel_history: '',
                travel_end: '',
                epid_link: '',
                latitude: '',
                longitude: '',
                remarks: ''
            }, {
                id: feature.FID,
                code: feature.FN_masterl,
                age: feature.edad,
                sex: feature.kasarian.toLowerCase(),
                status: feature.status,
                confirmed_date: feature.confirmed,
                nationality: feature.nationalit,
                travel_date: feature.travel_dat,
                travel_history: feature.travel_his,
                travel_end: feature.where_now,
                epid_link: feature.epid_link,
                latitude: feature.latitude,
                longitude: feature.longitude
            });

            data.stat.total += 1;

            util.setAgeGroup(feature, data);
            util.increment(feature.sex, data.stat.sex);

            if (feature.travel_history) {
                feature.remarks = (feature.travel_history.split(';')[1] || '').trim();
                feature.travel_history = feature.travel_history.split(';')[0].split(',');

                const clean = [];
                for (let j = 0; j < feature.travel_history.length; ++j) {
                    const country = feature.travel_history[j].trim();
                    clean.push(country);
                    util.increment(country, data.stat.travel_history);
                }

                feature.travel_history = clean;
            }

            util.increment(feature.travel_end, data.stat.travel_end);
            util.increment(feature.nationality, data.stat.nationality);

            data.list.push(feature);
        }

        params.resultOffset += params.resultRecordCount;
    } while (res.features.length === params.resultRecordCount);

    data.stat.ageGroup = util.orderKeys(data.stat.ageGroup);
    data.stat.ageGroupSex = util.orderKeys(data.stat.ageGroupSex);
    data.stat.nationality = util.orderKeys(data.stat.nationality);
    data.stat.travel_end = util.orderKeys(data.stat.travel_end);
    data.stat.travel_history = util.orderKeys(data.stat.travel_history);

    return data;
};
