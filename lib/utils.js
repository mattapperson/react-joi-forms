import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$keys from 'babel-runtime/core-js/object/keys';
export var reduce = function reduce(list, reducer, acc) {
  return Array.prototype.reduce.call(list, reducer, acc);
};

export var keys = _Object$keys.bind(Object);

export var assign = _Object$assign.bind(Object);

export var noop = function noop() {};

export function makeObject() {
  var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var values = arguments[1];

  return reduce(list, function (acc, val, i) {
    return _extends({}, acc, _defineProperty({}, val, values[i]));
  }, {});
}

export function merge(obj) {
  return obj.length ? assign.apply(undefined, [{}].concat(_toConsumableArray(obj))) : obj;
}

export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function getTaggedFields() {
  var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var tag = arguments[1];

  var fields = schema.filter(function (f) {
    return f._tags.indexOf(tag) !== -1;
  });
  return fields.length < 1 ? null : fields; // if tag does not match tag(s) in schema, render nothing
}

export function assertSchema(schema) {
  if (!schema.isJoi) {
    throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
  }

  if (!schema._flags || !schema._flags.label) {
    throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
  }
}

export function defaultValues(schema, values) {
  return reduce(schema, function (acc, fieldSchema) {
    var meta = merge(fieldSchema._meta);
    var name = meta.name || camelize(fieldSchema._flags.label);
    var vs = {};
    // if no value set for this field, but their is a default, set it
    var hasDefault = values[name] === undefined && fieldSchema._flags.default !== undefined;
    if (hasDefault) vs[name] = fieldSchema._flags.default;

    // if no value set for this field, but is boolean, set it to false
    var setBoolean = values[name] === undefined && fieldSchema._type === 'boolean';
    if (setBoolean) vs[name] = false;

    return _extends({}, acc, vs);
  }, {});
}