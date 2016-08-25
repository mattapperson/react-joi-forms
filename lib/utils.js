'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.makeObject = makeObject;
exports.merge = merge;
exports.camelize = camelize;
exports.getTaggedFields = getTaggedFields;
exports.assertSchema = assertSchema;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reduce = function reduce(list, reducer, acc) {
  return Array.prototype.reduce.call(list, reducer, acc);
};

exports.reduce = reduce;
var keys = Object.keys.bind(Object);

exports.keys = keys;
var assign = Object.assign.bind(Object);

exports.assign = assign;
var noop = function noop() {};

exports.noop = noop;

function makeObject(list, values) {
  if (list === undefined) list = [];

  return reduce(list, function (acc, val, i) {
    return _extends({}, acc, _defineProperty({}, val, values[i]));
  }, {});
}

function merge(obj) {
  return obj.length ? assign.apply(undefined, [{}].concat(_toConsumableArray(obj))) : obj;
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function getTaggedFields(schema, tag) {
  if (schema === undefined) schema = [];

  var fields = schema.filter(function (f) {
    return f._tags.indexOf(tag) !== -1;
  });
  return fields.length < 1 ? null : fields; // if tag does not match tag(s) in schema, render nothing
}

function assertSchema(schema) {
  if (!schema.isJoi) {
    throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
  }

  if (!schema._settings.language || !schema._settings.language.label) {
    throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
  }
}