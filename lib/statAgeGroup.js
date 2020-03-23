'use strict';

const qs = require('querystring');
const req = require('./request');

const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/age_group/FeatureServer/0/query';
const params = {
    f: 'json',
    groupByFieldsForStatistics: 'age_categ,sex',
    outStatistics: JSON.stringify([{
        statisticType: 'count',
        onStatisticField: 'FID',
        outStatisticFieldName: 'value'
    }])
};

module.exports = async () => {

    const data = {};
    const res = await req(`${ path }?${ qs.stringify(params) }`);

    for (let i = 0; i < res.features.length; ++i) {
        const feature = res.features[i].attributes;

        if (!data[feature.age_categ]) {
            data[feature.age_categ] = { male: 0, female: 0 };
        }

        data[feature.age_categ][feature.sex.toLowerCase()] += feature.value;
    }

    return { stat: data };
};
