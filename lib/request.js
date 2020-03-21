'use strict';

const https = require('https');

module.exports = (url, notJSON) => {

    return new Promise((resolve, reject) => {

        const req = https.get(url, (res) => {

            if (res.statusCode < 200 || res.statusCode >= 300) {

                return reject(new Error(`statusCode=${ res.statusCode }`));
            }

            let body = [];

            res.on('data', (chunk) => {

                body.push(chunk);
            });

            res.on('end', () => {

                try {
                    if (notJSON) {
                        body = Buffer.concat(body).toString();
                    }
                    else {
                        body = JSON.parse(Buffer.concat(body).toString());
                    }
                }
                catch (e) {

                    reject(e);
                }

                resolve(body);
            });
        });

        req.on('error', (err) => {

            reject(err);
        });

        req.end();
    });
};
