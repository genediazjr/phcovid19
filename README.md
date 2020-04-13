# phcovid19
[![Build Status](https://travis-ci.org/genediazjr/phcovid19.svg?branch=master)](https://travis-ci.org/genediazjr/phcovid19)
[![Coverage Status](https://coveralls.io/repos/github/genediazjr/phcovid19/badge.svg)](https://coveralls.io/github/genediazjr/phcovid19)
[![NPM Version](https://badge.fury.io/js/phcovid19.svg)](https://www.npmjs.com/phcovid19)
[![NPM Downloads](https://img.shields.io/npm/dt/phcovid19.svg?maxAge=2592000)](https://www.npmjs.com/phcovid19)<br>
[![dependencies Status](https://david-dm.org/genediazjr/phcovid19/status.svg)](https://david-dm.org/genediazjr/phcovid19)
[![devDependencies Status](https://david-dm.org/genediazjr/phcovid19/dev-status.svg)](https://david-dm.org/genediazjr/phcovid19?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/genediazjr/phcovid19/badge.svg)](https://snyk.io/test/github/genediazjr/phcovid19)

# !!!DEPRECATED!!!

Yet another PH COVID19 Stat Generator

### Programmatically
```js
const phcovid19 = require('phcovid19');

(async () => {

    const stats = await phcovid19.load();
    console.log(stats);
})();
```

### Command Line
```sh
$ npm install -g phcovid19
$ phcovid19 stats.json
```

### Data Source
DOH COVID19 Case Tracker [https://www.doh.gov.ph/2019-nCoV](https://www.doh.gov.ph/2019-nCoV)

### Contributing
* Include at least 90% test coverage :sweat_smile: and no eslint issue.
* Submit an issue first for significant changes.
