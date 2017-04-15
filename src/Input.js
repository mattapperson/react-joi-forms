import React, { Component, PropTypes } from "react";
import Joi from "joi-browser";
import {
    merge,
    makeObject,
    camelize,
    getTaggedFields,
    assertSchema
} from "./utils";

const { object, string } = PropTypes;

const debug = console.error;

const __onChange = handler => e => {
    if (e.preventDefault) e.preventDefault();
    if (!handler) return;

    const name = e.target.name;
    const index = e.target.index;
    const value = e.target.value;
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const pos = index >= 0 ? "[" + index + "]" : "";
    const change = { [name + pos]: files || value };
    handler(e, change);
};

const __onEvent = handler => e => {
    if (handler) handler(e);
};

class Input extends Component {
    static propTypes = {
        name: string,
        type: string,
        style: object
    };

    static defaultProps = {
        name: "",
        fetchOptions: {},
        fetchHeaders: {}
    };

    static contextTypes = {
        joiForm: object,
        joiFormGlobal: PropTypes.object
    };

    render() {
        const { name, onChange, onFocus, onBlur } = this.props;
        const { joiForm: formContext, joiFormGlobal } = this.context;

        if (!formContext) return <div />;

        const options = this.__getFieldParams(
            this.props,
            formContext.schema[name],
            formContext.errors[name]
        );

        const fieldComponentCreator = joiFormGlobal.components[options.type];

        const fieldEvents = {
            onChange: __onChange(formContext.onChange),
            onFocus: __onEvent(formContext.onEvent),
            onBlur: __onEvent(formContext.onEvent)
        };

        if (!fieldComponentCreator) {
            return <span>No component of type {options.type} was found</span>;
        }

        return fieldComponentCreator(options, fieldEvents);
    }

    __getFieldParams = (props, fieldSchema, errors) => {
        var options = {
            schema: fieldSchema,
            errors: errors,
            type: "text",
            label: fieldSchema._flags.label,
            required: fieldSchema._flags.presence === "required",
            default: fieldSchema._flags.default
        };

        if (fieldSchema._meta.length !== 0) {
            Object.assign(options, Object.assign(...fieldSchema._meta));
        }

        Object.assign(options, props);

        options.key = options.name;

        // const multiField = options.multi;
        // const schemaForValids = multiField
        //     ? fieldSchema._inner.items[0]
        //     : fieldSchema;
        //
        //
        // const hasValidsSet = schemaForValids._valids &&
        //     schemaForValids._valids._set &&
        //     schemaForValids._valids._set.length > 0;
        //
        // let optionNames, optionValues;
        // if (hasValidsSet) {
        //     optionValues = schemaForValids._meta.names ||
        //         schemaForValids._valids._set;
        //     optionNames = schemaForValids._valids._set;
        // }
        //
        // options = {
        //     allowed: optionValues,
        // };
        return options;
    };
}

export default Input;
