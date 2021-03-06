'use strict';

const qs = require('querystring');
const req = require('./request');
const util = require('./util');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PH_masterlist/FeatureServer/0/query';
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
            residence: {},
            facility: {},
            symptoms: {},
            remarks: {},
            status: {}
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
                remarks: '',
                facility: '',
                residence: '',
                nationality: '',
                confirmed_date: '',
                symptoms: '',
                longitude: '',
                latitude: '',
                epi_link: ''
            }, {
                id: feature.FID,
                code: feature.PH_masterl,
                age: feature.edad,
                sex: feature.kasarian.toLowerCase(),
                status: feature.status,
                remarks: util.fixProfileRemarks(feature.travel_hx),
                facility: util.fixFacilityName(feature.facility),
                residence: util.fixResidence(feature.residence),
                nationality: feature.nationalit,
                confirmed_date: feature.confirmed,
                symptoms: feature.symptoms,
                longitude: feature.longitude,
                latitude: feature.latitude,
                epi_link: feature.epi_link
            });

            data.stat.total += 1;

            util.setAgeGroup(feature, data);
            util.increment(feature.sex, data.stat.sex);
            util.increment(feature.nationality, data.stat.nationality);
            util.increment(feature.residence, data.stat.residence);
            util.increment(feature.facility, data.stat.facility);
            util.increment(feature.symptoms, data.stat.symptoms);
            util.increment(feature.remarks, data.stat.remarks);
            util.increment(feature.status, data.stat.status);

            data.list.push(feature);
        }

        params.resultOffset += params.resultRecordCount;
    } while (res.features.length === params.resultRecordCount);

    data.stat.ageGroup = util.orderKeys(data.stat.ageGroup);
    data.stat.ageGroupSex = util.orderKeys(data.stat.ageGroupSex);
    data.stat.nationality = util.orderKeys(data.stat.nationality);
    data.stat.residence = util.orderKeys(data.stat.residence);
    data.stat.facility = util.orderKeys(data.stat.facility);
    data.stat.symptoms = util.orderKeys(data.stat.symptoms);
    data.stat.remarks = util.orderKeys(data.stat.remarks);
    data.stat.status = util.orderKeys(data.stat.status);

    return data;
};
