import _toConsumableArray from "babel-runtime/helpers/toConsumableArray";
import _Object$assign from "babel-runtime/core-js/object/assign";
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

var Input = function (_Component) {
    _inherits(Input, _Component);

    function Input() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Input);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Input.__proto__ || _Object$getPrototypeOf(Input)).call.apply(_ref, [this].concat(args))), _this), _this.__getFieldParams = function (props, fieldSchema, errors) {
            var options = _Object$assign({
                schema: fieldSchema,
                errors: errors,
                type: "text",
                label: fieldSchema._flags.label,
                required: fieldSchema._flags.presence === "required",
                default: fieldSchema._flags.default
            }, _Object$assign.apply(Object, _toConsumableArray(fieldSchema._meta)), props);

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
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Input, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                name = _props.name,
                type = _props.type;

            // const { joiForm: context } = this.context;
            // const {
            //     schema,
            //     onChange,
            //     onSelect2Search,
            //     onAutocompleteSearch,
            //     onFocus,
            //     onBlur
            // } = context;
            //
            // const fieldSchema = name === undefined
            //     ? null
            //     : getFieldSchemaByName(schema || {}, name);
            //
            // const fieldParams = this.__getFieldParams(this.props, fieldSchema);
            //
            // const fieldComponentCreator = context[`${fieldComponent}Component`];
            // if (!fieldComponentCreator) {
            //     debug(
            //         "[JoiForm Error] The requested input type of " +
            //             fieldComponent +
            //             " does not have a defined component"
            //     );
            //     return (
            //         <span>
            //             Input type
            //             {" "}
            //             {fieldComponent}
            //             {" "}
            //             does not have a defined component type
            //         </span>
            //     );
            // }
            //
            // const fieldErrors = context.getErrors(fieldName);
            // const fieldValue = context.getValue(fieldName);
            // const fieldEvents = {
            //     onChange: __onChange(onChange),
            //     onSelect2Search: __onSelect2Search(onSelect2Search),
            //     onAutocompleteSearch: __onAutocompleteSearch(onAutocompleteSearch),
            //     onFocus: __onEvent(onFocus),
            //     onBlur: __onEvent(onBlur)
            // };
            //
            // return fieldComponentCreator(
            //     fieldErrors,
            //     fieldValue,
            //     options,
            //     fieldEvents
            // );

            return React.createElement("div", { style: this.props.style });
        }
    }]);

    return Input;
}(Component);

Input.propTypes = {
    name: string,
    type: string,
    style: object
};
Input.contextTypes = {
    joiForm: object
};


export default Input;