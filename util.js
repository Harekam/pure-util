/**
 * Created by harekam on 27/08/15.
 */

var config = require('./config');
var moment = require('moment');
require('moment-timezone');
require('moment-range');


/**
 *
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
/**
 *
 * @param length
 * @param config typeOf Object having configurations like typeOfString(Num, Alpha, UpperAlpha, LowerAlpha) and customString
 * @returns {string}
 */
function generateRandomString(length, config) {

    var charsNumbers = '0123456789';
    var charsLower = 'abcdefghijklmnopqrstuvwxyz';
    var charsUpper = charsLower.toUpperCase();
    var chars = charsNumbers + charsLower + charsUpper;
    config = typeof config === "object" ? config : {};


    if (typeof config.customString === "string")
        chars = config.customString;
    else {
        switch (config.typeOfString) {
            case config.TYPE_OF_STRING.NUM:
                chars = charsNumbers;
                break;
            case config.TYPE_OF_STRING.ALPHA:
                chars = charsLower + charsUpper;
                break;
            case config.TYPE_OF_STRING.UPPER_ALPHA:
                chars = charsUpper;
                break;
            case config.TYPE_OF_STRING.LOWER_ALPHA:
                chars = charsLower;
                break;
        }
    }
    if (!length) length = 32;

    var string = '';

    for (var i = 0; i < length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
}

/**
 * @about This function validate timezone by using moment library
 * @param timezone
 * @returns {boolean}
 */
function validateTimezone(timezone) {
    var result = moment.tz.zone(timezone);
    return !isEmpty(result);
}

/**
 *
 * @param startDate
 * @param endDate
 * @param diffIn
 * @returns {*}
 */
function getRange(startDate, endDate, diffIn) {

    var dr = moment.range(startDate, endDate);

    diffIn = !diffIn ? config.TIME_UNITS.HOURS : diffIn;

    return dr.diff(diffIn);

}
/**
 * @about this func return non empty json
 * @param payload
 * @returns {{}}
 */
function createValidJson(payload) {
    var data = {};
    payload = typeof payload === "object" ? payload : {};
    for (var key in payload) {
        if (payload.hasOwnProperty(key) && !isEmpty(payload[key])) {
            data[key] = payload[key];
        }
    }
    return data;
}
/**
 * @about makes array from a key of array of objects
 * @param data
 * @param keyName
 * @returns {Array}
 */
var makeArrayOfKey = function (data, keyName) {
    var arr = [];
    if (isEmpty(data) || isEmpty(keyName))return null;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            arr.push(data[key][keyName]);
        }
    }
    return arr;
};
/**
 *
 * @param date
 * @param inISO boolean
 * @param unit
 * @param frequency +/-
 * @returns {*}
 */
function getCustomDate(date, inISO, unit, frequency) {

    var end = moment(date).add(frequency, unit).toDate();

    if (inISO)
        return end.toISOString();
    else
        return end;

}
function createHashFromArrayOfObjects(data, key) {
    var len = data.length;
    var map = {};
    for (var i = 0; i < len; i++) {
        map[data[i][key]] = true;
    }
    return map;
}
function formatDateTime(datetime, format, inMomentObject) {

    format = !format ? config.JAVASCRIPT_TIMESTAMP_FORMAT : format;

    var momentDateTime = moment(datetime).format(format);

    if (inMomentObject)
        return momentDateTime;
    return new Date(momentDateTime);
}
function getLocalTimestamp(datetime, timezone, format) {
    format = !format ? config.JAVASCRIPT_TIMESTAMP_FORMAT : format;
    timezone = !timezone ? config.TIMEZONE_INDIA : timezone;
    var dateTimeLocal = moment.tz(datetime, timezone);
    return dateTimeLocal.format(format);
}
function getDay(date) {
    if (!date)
        date = new Date();
    logger.debug(date);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[date.getDay()];
}
function getMonthName(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (!date)
        date = new Date();
    return monthNames[date.getMonth()];

}
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function htmlUnEscape(str) {
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}
function createHashOfArray(array) {
    var map = {};
    var len = array.length;
    for (var i = 0; i < len; i++) {
        map[array[i]] = true;
    }
    return map;
}
function isContains(element, array) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
        if (element == array[i])
            return true;
    }
    return false
}
function getTimestamp(inISO) {
    if (inISO)
        return new Date().toISOString();

    return new Date();
}
module.exports = {
    getTimestamp: getTimestamp,
    createValidJson: createValidJson,
    isEmpty: isEmpty,
    makeArrayOfKey: makeArrayOfKey,
    getRange: getRange,
    validateTimezone: validateTimezone,
    generateRandomString: generateRandomString,
    getCustomDate: getCustomDate,
    getLocalTimestamp: getLocalTimestamp,
    createHashFromArrayOfObjects: createHashFromArrayOfObjects,
    formatDateTime: formatDateTime,
    getDay: getDay,
    getMonthName: getMonthName,
    htmlEscape: htmlEscape,
    htmlUnEscape: htmlUnEscape,
    createHashOfArray: createHashOfArray,
    isContains: isContains
};
