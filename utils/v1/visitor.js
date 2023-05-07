
var countryData = require('country-data');
var momentTz = require('moment-timezone');
var latest_json = require('moment-timezone/data/meta/latest.json');
var UAParser = require('ua-parser-js');
var timezone, countryCode, country, results, navigator, ip, headers, url, date;
var requestIp = require('request-ip');



function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var momentTz__default = /*#__PURE__*/_interopDefaultLegacy(momentTz);
var UAParser__default = /*#__PURE__*/_interopDefaultLegacy(UAParser);

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }

    return keys;
}

function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }

    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }

    return obj;
}

var timezone, countryCode, country, results; // eslint-disable-line prefer-const

var getTimezone = function getTimezone() {
    return timezone || momentTz__default["default"].tz.zone(momentTz__default["default"].tz.guess());
};

var getCountryCode = function getCountryCode() {
    return countryCode || latest_json.zones[timezone.name] && latest_json.zones[timezone.name].countries[0];
};

var getCountry = function getCountry() {
    return country || countryData.callingCountries.all.find(function (item) {
        return item.alpha2 === getCountryCode();
    });
};

var getResult = function getResult() {
    return results || new UAParser__default["default"](headers["user-agent"]).getResult();
};

var getIP = function getIP(req) {
    return ip || requestIp.getClientIp(req);
};
var getDate = function getDate() {
    let result = {
        user: new Date().toLocaleString('en-SG', {
            hour12: false
        }),
        system: new Date().toLocaleString('en-SG', {
            timeZone: 'Asia/Singapore',
            hour12: false
        })
    }
    return date || result;
};
export function vi(req) {
    headers = req.headers
    url = headers.referer
    timezone = getTimezone();
    countryCode = getCountryCode();
    country = getCountry();
    country.location = timezone.name
    country.code = countryCode
    results = getResult();
    ip = getIP(req);
    date = getDate();

    return _objectSpread2({
        date,
        country,
        ip,
        url,
        query: req.query,
        body: req.body
    }, results);
} 