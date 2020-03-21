'use strict';

const qs = require('querystring');
const req = require('./request');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const path = 'https://dohph.maps.arcgis.com/sharing/rest/content/items/3dda5e52a7244f12a4fb3d697e32fd39/data';
const param = { f: 'json' };

module.exports = async () => {

    const data = { asOf: '', alertLevel: '' };
    const res = await req(`${ path }?${ qs.stringify(param) }`);

    const widget = res.widgets[13];
    if (widget && widget.text) {
        const dom = new JSDOM(widget.text.replace('\n', ''));
        const matches = dom.window.document.querySelectorAll('p');
        if (matches[1]) {
            data.alertLevel = matches[1].textContent;
        }
    }

    if (res.headerPanel &&
        res.headerPanel.title) {
        data.asOf = res.headerPanel.title;
    }

    return { stat: data };
};
