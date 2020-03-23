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
    resultOffset: '0',
    resultRecordCount: '10000000',
    returnGeometry: 'false',
    cacheHint: true
};

module.exports = async () => {

    const data = { list: [] };
    const res = await req(`${ path }?${ qs.stringify(params) }`);

    for (let i = 0; i < res.features.length; ++i) {
        const feature = res.features[i].attributes;
        data.list.push(feature);
    }

    return data;
};
