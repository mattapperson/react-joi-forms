"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _joiBrowser = require("joi-browser");

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var object = _react.PropTypes.object,
    string = _react.PropTypes.string;


var debug = console.error;

var __onChange = function __onChange(handler) {
    return function (e) {
        if (e.preventDefault) e.preventDefault();
        if (!handler) return;

        var name = e.target.name;
        var index = e.target.index;
        var value = e.target.value;
        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        debug("foo");
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

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Input.__proto__ || Object.getPrototypeOf(Input)).call.apply(_ref, [this].concat(args))), _this), _this.__getFieldParams = function (props, fieldSchema, errors) {
            var options = Object.assign({
                schema: fieldSchema,
                errors: errors,
                type: "text",
                label: fieldSchema._flags.label,
                required: fieldSchema._flags.presence === "required",
                default: fieldSchema._flags.default
            }, Object.assign.apply(Object, _toConsumableArray(fieldSchema._meta)), props);

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

            return _react2.default.createElement("div", { style: this.props.style });
        }
    }]);

    return Input;
}(_react.Component);

Input.propTypes = {
    name: string,
    type: string,
    style: object
};
Input.contextTypes = {
    joiForm: object
};
exports.default = Input;