import _extends from "babel-runtime/helpers/extends";
import _Object$getPrototypeOf from "babel-runtime/core-js/object/get-prototype-of";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import _defineProperty from "babel-runtime/helpers/defineProperty";
import React, { Component, PropTypes } from "react";
import Joi from "joi-browser";
import { merge, makeObject, camelize, getTaggedFields, assertSchema } from "./utils";

var object = PropTypes.object,
    string = PropTypes.string;


var debug = console.error;

var __onChange = function __onChange(handler) {
    return function (e) {
        if (e.preventDefault) e.preventDefault();
        if (!handler) return;

        var name = e.target.name;
        var index = e.target.index;
        var value = e.target.value;
        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

        var pos = index >= 0 ? "[" + index + "]" : "";
        var change = _defineProperty({}, name + pos, files || value);
        handler(e, change);
    };
};

var __onEvent = function __onEvent(handler) {
    return function (e) {
        if (handler) handler(e);
    };
};

var FormSection = function (_Component) {
    _inherits(FormSection, _Component);

    function FormSection() {
        _classCallCheck(this, FormSection);

        return _possibleConstructorReturn(this, (FormSection.__proto__ || _Object$getPrototypeOf(FormSection)).apply(this, arguments));
    }

    _createClass(FormSection, [{
        key: "render",
        value: function render() {
            var tag = this.props.tag;
            var context = this.context.joiForm;
            var schema = context.schema,
                onChange = context.onChange,
                onSelect2Search = context.onSelect2Search,
                onAutocompleteSearch = context.onAutocompleteSearch,
                onFocus = context.onFocus,
                onBlur = context.onBlur;


            var fields = tag === undefined ? schema : getTaggedFields(schema, tag);

            return React.createElement(
                "div",
                { style: this.props.style },
                fields && fields.map(function (fieldSchema) {
                    assertSchema(fieldSchema);
                    fieldSchema._meta = merge(fieldSchema._meta);

                    var multiField = fieldSchema._meta.multi;
                    var schemaForValids = multiField ? fieldSchema._inner.items[0] : fieldSchema;
                    schemaForValids._meta = merge(schemaForValids._meta);

                    var fieldComponent = fieldSchema._meta.component || "text";
                    var fieldName = fieldSchema._meta.name || camelize(fieldSchema._flags.label);

                    var hasValidsSet = schemaForValids._valids && schemaForValids._valids._set && schemaForValids._valids._set.length > 0;
                    // ---
                    // NOTE: commenting the code below for hotfixing but leaving it here for further review.
                    // We shouldn't hide components without valids set because schemas and data are
                    // dynamic. We may change the valids of one component based on the another inputs
                    // text, thus hiding and showing is not optimal regarding UX
                    // ---
                    // const isEnumerated = (fieldComponent === 'select' || fieldComponent === 'select2');
                    // if (isEnumerated && !hasValidsSet) {
                    //   debug(`${fieldName} is a ${fieldComponent} ${multiField ? 'with multiple values' : ''} component but no 'valid' params are provided, field is ignored`);
                    //   return null;
                    // }
                    // ---

                    var optionNames = void 0,
                        optionValues = void 0;
                    if (hasValidsSet) {
                        optionValues = schemaForValids._meta.names || schemaForValids._valids._set;
                        optionNames = schemaForValids._valids._set;
                    }

                    var options = _extends({}, fieldSchema._meta, {
                        required: fieldSchema._flags.presence === "required",
                        name: fieldName,
                        label: fieldSchema._flags.label,
                        key: fieldName,
                        allowed: optionValues,
                        default: fieldSchema._flags ? fieldSchema._flags.default : undefined
                    });

                    switch (fieldComponent) {
                        case "text":
                            options.placeholder = fieldSchema._examples[0] || undefined;
                            break;

                        case "select":
                        case "select2":
                            options.enums = makeObject(optionNames, optionValues);
                            break;

                        case "form":
                            options.formType = fieldSchema._type; // should be either object or array
                            var schemaProvider = options.type === "object" ? fieldSchema._inner.children // we get an array of [key, schema] as children for object items
                            : fieldSchema._inner.items[0]._inner.children; // we get an array of [key, schema] from the first valid item type of the array - that should be an object

                            options.schema = schemaProvider.map(function (c) {
                                return c.schema;
                            });
                            break;
                    }

                    var fieldComponentCreator = context[fieldComponent + "Component"];
                    if (!fieldComponentCreator) {
                        debug("[JoiForm Error] The requested input type of " + fieldComponent + " does not have a defined component");
                        return React.createElement(
                            "span",
                            null,
                            "Input type",
                            " ",
                            fieldComponent,
                            " ",
                            "does not have a defined component type"
                        );
                    }

                    var fieldErrors = context.getErrors(fieldName);
                    var fieldValue = context.getValue(fieldName);
                    var fieldEvents = {
                        onChange: __onChange(onChange),
                        onSelect2Search: __onSelect2Search(onSelect2Search),
                        onAutocompleteSearch: __onAutocompleteSearch(onAutocompleteSearch),
                        onFocus: __onEvent(onFocus),
                        onBlur: __onEvent(onBlur)
                    };

                    return fieldComponentCreator(fieldErrors, fieldValue, options, fieldEvents);
                })
            );
        }
    }]);

    return FormSection;
}(Component);

FormSection.propTypes = {
    tag: string,
    style: object
};
FormSection.contextTypes = {
    joiForm: object
};


export default FormSection;