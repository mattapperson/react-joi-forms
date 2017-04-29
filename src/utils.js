export const reduce = (list, reducer, acc) =>
    Array.prototype.reduce.call(list, reducer, acc);

export const keys = Object.keys.bind(Object);

export const assign = Object.assign.bind(Object);

export const noop = () => {return null};

export function makeObject(list = [], values) {
    return reduce(list, (acc, val, i) => ({ ...acc, [val]: values[i] }), {});
}

export function merge(obj) {
    return obj.length ? assign({}, ...obj) : obj;
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
    if (!schema.isJoi) {
        throw new Error(
            "An array of Joi objects is what we expect for joi-react-forms."
        );
    }

    if (!schema._flags || !schema._flags.label) {
        throw new Error(
            "All joi-react-form elements MUST have a label or a name meta key/value"
        );
    }
}

export function defaultValues(schema, values) {
    return reduce(
        schema,
        (acc, fieldSchema) => {
            const meta = merge(fieldSchema._meta);
            const name = meta.name || camelize(fieldSchema._flags.label);
            let vs = {};
            // if no value set for this field, but their is a default, set it
            const hasDefault =
                values[name] === undefined &&
                fieldSchema._flags.default !== undefined;
            if (hasDefault) vs[name] = fieldSchema._flags.default;

            // if no value set for this field, but is boolean, set it to false
            const setBoolean =
                values[name] === undefined && fieldSchema._type === "boolean";
            if (setBoolean) vs[name] = false;

            return { ...acc, ...vs };
        },
        {}
    );
}

export const isReactNative =
    typeof navigator === "object" && navigator.product === "ReactNative";
