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

const __onChange = handler =>
    e => {
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

const __onEvent = handler =>
    e => {
        if (handler) handler(e);
    };

class FormSection extends Component {
    static propTypes = {
        name: string,
        type: string,
        style: object
    };

    static contextTypes = {
        joiForm: object
    };

    render() {
        const { name, type } = this.props;
        const { joiForm: context } = this.context;
        const {
            schema,
            onChange,
            onSelect2Search,
            onAutocompleteSearch,
            onFocus,
            onBlur
        } = context;

        const fieldSchema = name === undefined
            ? null
            : getFieldSchemaByName(schema, name);

        const fieldParams = this.__getFieldParams(this.props, fieldSchema);

        const fieldComponentCreator = context[`${fieldComponent}Component`];
        if (!fieldComponentCreator) {
            debug(
                "[JoiForm Error] The requested input type of " +
                    fieldComponent +
                    " does not have a defined component"
            );
            return (
                <span>
                    Input type
                    {" "}
                    {fieldComponent}
                    {" "}
                    does not have a defined component type
                </span>
            );
        }

        const fieldErrors = context.getErrors(fieldName);
        const fieldValue = context.getValue(fieldName);
        const fieldEvents = {
            onChange: __onChange(onChange),
            onSelect2Search: __onSelect2Search(onSelect2Search),
            onAutocompleteSearch: __onAutocompleteSearch(onAutocompleteSearch),
            onFocus: __onEvent(onFocus),
            onBlur: __onEvent(onBlur)
        };

        return fieldComponentCreator(
            fieldErrors,
            fieldValue,
            options,
            fieldEvents
        );

        return <div style={this.props.style} />;
    }

    __getFieldParams = (props, fieldSchema) => {
        const { name, type } = this.props;
        var options = merge(fieldSchema._meta);

        // const multiField = options.multi;
        // const schemaForValids = multiField
        //     ? fieldSchema._inner.items[0]
        //     : fieldSchema;
        //
        // const fieldName = options.name;
        //
        // const fieldComponent = fieldSchema._meta.component ||
        //     props.type ||
        //     "text";
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
        //     ...fieldSchema._meta,
        //     required: fieldSchema._flags.presence === "required",
        //     name: fieldName,
        //     label: fieldSchema._flags.label,
        //     key: fieldName,
        //     allowed: optionValues,
        //     default: fieldSchema._flags ? fieldSchema._flags.default : undefined
        // };
    };
}

export default FormSection;
