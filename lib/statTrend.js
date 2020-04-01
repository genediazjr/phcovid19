'use strict';

const qs = require('querystring');
const req = require('./request');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/confirmed/FeatureServer/0/query';
const params = {
    f: 'json',
    where: '1=1',
    orderByFields: 'date asc',
    spatialRel: 'esriSpatialRelIntersects',
    outSR: '102100',
    outFields: '*',
    resultOffset: 0,
    resultRecordCount: 1000,
    returnGeometry: 'false'
};

module.exports = async () => {

    params.resultOffset = 0;

    const data = { list: [] };

    let res;
    do {
        res = await req(`${ path }?${ qs.stringify(params) }`);

        for (let i = 0; i < res.features.length; ++i) {
            const feature = res.features[i].attributes;
            data.list.push(feature);
        }

        params.resultOffset += params.resultRecordCount;
    } while (res.features.length === params.resultRecordCount);

    return data;
};
