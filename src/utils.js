export const reduce = (list, reducer, acc) => Array.prototype.reduce.call(list, reducer, acc)

export const keys = Object.keys.bind(Object);

export const assign = Object.assign.bind(Object);

export const noop = () => {};

export function makeObject(list = [], values) {
  return reduce(list, (acc, val, i) => (acc[val] = values[i]), {});
}

export function merge(obj) {
  return (obj.length) ? assign({}, ...obj) : obj;
}

export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function getTaggedFields(schema = [], tag) {
  const fields = schema.filter(f => f._tags.indexOf(tag) !== -1);
  return fields.length < 1 ? null : fields; // if tag does not match tag(s) in schema, render nothing
}

export function assertSchema(schema) {
  if(!fieldSchema.isJoi) {
    throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
  }

  if(!fieldSchema._settings.language || !fieldSchema._settings.language.label) {
    throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
  }
}
