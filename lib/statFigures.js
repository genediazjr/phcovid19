/* eslint no-process-env: "off" */
'use strict';

const qs = require('querystring');
const req = require('./request');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const main = 'https://www.doh.gov.ph/2019-nCoV';
const path = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query';
const byType = (type) => {

    return {
        f: 'json',
        outStatistics: JSON.stringify([{
            statisticType: 'sum',
            onStatisticField: type,
            outStatisticFieldName: 'value'
        }])
    };
};

module.exports = async () => {

    const iter = [];
    const data = {
        confirmed: 'confirmed',
        recovered: 'recovered',
        died: 'deaths',
        puis: 'PUIs',
        pums: 'PUMs',
        tests_conducted: 'tests'
    };

    for (const type in data) {
        if (Object.prototype.hasOwnProperty.call(data, type)) {

            iter.push((async () => {

                const res = await req(`${ path }?${ qs.stringify(byType(data[type])) }`);
                data[type] = res.features[0].attributes.value;
            })());
        }
    }

    await Promise.all(iter);

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    //
    // const mainDOM = new JSDOM(await req(main, true));
    // const matches = mainDOM.window.document.querySelectorAll('#block-block-17 table tr');
    //
    // for (let i = 0; i < matches.length; ++i) {
    //     const cells = matches[i].querySelectorAll('td');
    //
    //     if (cells.length === 2) {
    //
    //         if (cells[0].textContent.trim().indexOf('negative') > -1) {
    //             data.tests_negative = parseInt(cells[1].textContent.trim());
    //         }
    //
    //         if (cells[0].textContent.trim().indexOf('pending') > -1) {
    //             data.tests_pending = parseInt(cells[1].textContent.trim());
    //         }
    //     }
    // }

    return { stat: data };
};
