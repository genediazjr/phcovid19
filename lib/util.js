'use strict';

const facilityNameFixes = {
    'DR. PAULINO J. GARCIA HOSPITAL': 'DR. PAULINO J GARCIA MEMORIAL RESEARCH AND MEDICAL CENTER',
    'LAS PINAS GENERAL HOSPITAL AND SATELITE TRAUMA CENTER': 'LAS PIÑAS GENERAL HOSPITAL AND SATELLITE TRAUMA CENTER',
    'MANILA DOCTOR\'S HOSPITAL': 'MANILA DOCTORS HOSPITAL',
    'ORTIGAS HOSPITAL AND HEALTH CARE CENTER': 'ORTIGAS HOSPITAL AND HEALTHCARE CENTER',
    'SAN JUAN DE DIOS EDUCATION FOUNDATION INC. HOSPITAL': 'SAN JUAN DE DIOS EDUCATIONAL FOUNDATION INC HOSPITAL',
    'SILANG SPECIALISTS MEDICAL CENTER': 'SILANG SPECIALIST MEDICAL CENTER',
    'UNIVERSITY OF THE EAST RAMON MAGSAYASY MEMORIAL MEDICAL CENTER': 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER'
};

const profileRemarksFixes = {
    'For validation': 'For Validation'
};

const residenceFixes = {
    'Las Pinas City': 'Las Piñas City',
    'Mandaluyong': 'Mandaluyong City',
    'Valenzuela': 'Valenzuela City',
    'Marikina': 'Marikina City'
};

exports.fixFacilityName = (name) => {

    if (name) {
        name = name.toUpperCase().replace('�', 'Ñ').trim();
        if (facilityNameFixes[name]) {
            name = facilityNameFixes[name];
        }
    }

    return name;
};

exports.fixProfileRemarks = (remarks) => {

    if (remarks) {
        remarks = remarks.trim();
        if (profileRemarksFixes[remarks]) {
            remarks = profileRemarksFixes[remarks];
        }
    }

    return remarks;
};

exports.fixResidence = (residence) => {

    if (residence) {
        residence = residence.replace('�', 'ñ').trim();
        if (residenceFixes[residence]) {
            residence = residenceFixes[residence];
        }
    }

    return residence;
};

exports.orderKeys = (object) => {

    const ordered = {};

    if (object) {
        Object.keys(object).sort().forEach((key) => {

            ordered[key] = object[key];
        });
    }

    return ordered;
};

exports.increment = (key, obj, count) => {

    if (key && key.trim) {
        key = key.trim();

        if (key === 'female' && !obj.male) {
            obj.male = 0;
        }

        if (!obj[key]) {
            obj[key] = 0;
        }

        if (key === 'male' && !obj.female) {
            obj.female = 0;
        }

        obj[key] += count || 1;
    }
};

exports.setAgeGroup = (feature, data) => {

    if (feature.age) {
        let ageGroup = 0;
        while (feature.age > ageGroup) {
            ageGroup += 10;
        }

        ageGroup = `${ ageGroup - 9 } to ${ ageGroup }`;

        if (!data.stat.ageGroupSex[ageGroup]) {
            data.stat.ageGroupSex[ageGroup] = {};
        }

        exports.increment(ageGroup, data.stat.ageGroup);
        exports.increment(feature.sex, data.stat.ageGroupSex[ageGroup]);
    }
};

exports.assign = (template, data) => {

    const merged = Object.assign(template, data);
    for (const key in merged) {
        if (Object.prototype.hasOwnProperty.call(merged, key)) {

            if (!merged[key]) {
                merged[key] = '';
            }

            if (merged[key].trim) {
                merged[key] = merged[key].trim();
            }
        }
    }

    return merged;
};
