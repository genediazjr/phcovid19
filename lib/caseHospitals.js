'use strict';

const qs = require('querystring');
const req = require('./request');
const util = require('./util');

const sources = {
    confirmed: {
        path: 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/conf_fac_tracking/FeatureServer/0/query',
        params: {
            f: 'json',
            where: '1=1',
            orderByFields: 'count_ desc',
            spatialRel: 'esriSpatialRelIntersects',
            outSR: '102100',
            outFields: '*',
            resultOffset: 0,
            resultRecordCount: 1000,
            returnGeometry: 'false'
        }
    },
    puis: {
        path: 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PUI_fac_tracing/FeatureServer/0/query',
        params: {
            f: 'json',
            where: '1=1',
            spatialRel: 'esriSpatialRelIntersects',
            outSR: '102100',
            outFields: '*',
            resultOffset: 0,
            resultRecordCount: 1000,
            returnGeometry: 'false'
        }
    }
};

module.exports = async () => {

    sources.confirmed.params.resultOffset = 0;
    sources.puis.params.resultOffset = 0;

    const data = {
        list: {},
        stat: {
            region: {},
            status: {
                confirmed: 0,
                puis: 0
            }
        }
    };

    let puis;
    do {
        puis = await req(`${ sources.puis.path }?${ qs.stringify(sources.puis.params) }`);

        for (let i = 0; i < puis.features.length; ++i) {
            const feature = puis.features[i].attributes;
            feature.hf = util.fixFacilityName(feature.hf);

            if (!data.list[feature.hf]) {
                data.list[feature.hf] = {};
            }

            data.list[feature.hf].puis = feature.PUIs;
            data.list[feature.hf].region = feature.region;
            data.list[feature.hf].latitude = feature.latitude;
            data.list[feature.hf].longitude = feature.longitude;

            if (feature.region) {
                if (!data.stat.region[feature.region]) {
                    data.stat.region[feature.region] = { confirmed: 0, puis: 0 };
                }

                data.stat.region[feature.region].puis += feature.PUIs;
            }

            data.stat.status.puis += feature.PUIs;
        }

        sources.puis.params.resultOffset += sources.puis.params.resultRecordCount;
    } while (puis.features.length === sources.puis.params.resultRecordCount);

    let confirmed;
    do {
        confirmed = await req(`${ sources.confirmed.path }?${ qs.stringify(sources.confirmed.params) }`);

        for (let i = 0; i < confirmed.features.length; ++i) {
            const feature = confirmed.features[i].attributes;
            feature.facility = util.fixFacilityName(feature.facility);

            if (!data.list[feature.facility]) {
                data.list[feature.facility] = {};
            }

            data.list[feature.facility].confirmed = feature.count_;
            data.list[feature.facility].latitude = feature.latitude;
            data.list[feature.facility].longitude = feature.longitude;

            if (feature.region) {
                if (!data.stat.region[feature.region]) {
                    data.stat.region[feature.region] = { confirmed: 0, puis: 0 };
                }

                data.stat.region[feature.region].confirmed += feature.count_;
            }

            data.stat.status.confirmed += feature.count_;
        }

        sources.confirmed.params.resultOffset += sources.confirmed.params.resultRecordCount;
    } while (confirmed.features.length === sources.confirmed.params.resultRecordCount);

    data.list = util.orderKeys(data.list);
    data.stat.region = util.orderKeys(data.stat.region);

    return data;
};
