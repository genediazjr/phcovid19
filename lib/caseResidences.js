'use strict';

const qs = require('querystring');
const req = require('./request');
const util = require('./util');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PH_masterlist/FeatureServer/0/query';
const params = {
    f: 'json',
    where: '1=1',
    orderByFields: 'value desc',
    groupByFieldsForStatistics: 'residence',
    spatialRel: 'esriSpatialRelIntersects',
    returnGeometry: 'false',
    outSR: '102100',
    outFields: '*',
    outStatistics: JSON.stringify([{
        statisticType: 'count',
        onStatisticField: 'FID',
        outStatisticFieldName: 'value'
    }])
};

module.exports = async () => {

    const data = { list: {}, stat: { total: 0 } };
    const res = await req(`${ path }?${ qs.stringify(params) }`);

    for (let i = 0; i < res.features.length; ++i) {
        const feature = res.features[i].attributes;
        feature.residence = util.fixResidence(feature.residence);

        util.increment(feature.residence, data.list, feature.value);
        data.stat.total += feature.value;
    }

    data.list = util.orderKeys(data.list);

    return data;
};
