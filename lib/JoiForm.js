"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _joiBrowser = require("joi-browser");

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

var _FormSection = require("./FormSection");

var _FormSection2 = _interopRequireDefault(_FormSection);

var _utils = require("./utils");

var _lodash = require("lodash.isequal");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JoiForm = function (_Component) {
    _inherits(JoiForm, _Component);

    function JoiForm(props) {
        _classCallCheck(this, JoiForm);

        var _this = _possibleConstructorReturn(this, (JoiForm.__proto__ || Object.getPrototypeOf(JoiForm)).call(this, props));

        _initialiseProps.call(_this);

        var state = {};

        var _props$schema = props.schema,
            schema = _props$schema === undefined ? {} : _props$schema,
            values = props.values,
            errors = props.errors;


        state.schema = schema;
        state.errors = errors;
        state.values = _extends({}, (0, _utils.defaultValues)(schema, values), values);
        _this.state = state;
        return _this;
    }

    _createClass(JoiForm, [{
        key: "getChildContext",
        value: function getChildContext() {
            var _props = this.props,
                schema = _props.schema,
                validateOpts = _props.validateOpts,
                textComponent = _props.textComponent,
                selectComponent = _props.selectComponent,
                textAreaComponent = _props.textAreaComponent,
                radioComponent = _props.radioComponent,
                checkboxComponent = _props.checkboxComponent,
                fileComponent = _props.fileComponent,
                formComponent = _props.formComponent,
                autocompleteComponent = _props.autocompleteComponent;


            return {
                joiForm: {
                    values: this.state.values,
                    errors: this.state.errors,
                    onChange: this.__onChange,
                    onFocus: this.__onFocus,
                    onBlur: this.__onBlur,

                    schema: schema,
                    validateOpts: validateOpts,
                    textComponent: textComponent,
                    selectComponent: selectComponent,
                    textAreaComponent: textAreaComponent,
                    radioComponent: radioComponent,
                    checkboxComponent: checkboxComponent,
                    fileComponent: fileComponent,
                    formComponent: formComponent,
                    autocompleteComponent: autocompleteComponent
                }
            };
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var schema = nextProps.schema;
            var isNextValuesEmpty = (0, _utils.keys)(nextProps.values).length === 0;
            var values = isNextValuesEmpty ? {} : _extends({}, this.state.values, nextProps.values);

            this.setState(_extends({}, this.state, { schema: schema, values: values }));
        }
    }, {
        key: "render",
        value: function render() {
            var _props2 = this.props,
                children = _props2.children,
                inline = _props2.inline;

            var childNodes = children || _react2.default.createElement(_FormSection2.default, null);
            var onSubmit = this.submit;

            var vnode = inline ? _react2.default.createElement(
                "div",
                null,
                childNodes
            ) : _react2.default.createElement(
                "form",
                { onSubmit: onSubmit },
                childNodes
            );
            return vnode;
        }
    }]);

    return JoiForm;
}(_react.Component);

JoiForm.propTypes = {
    schema: _react.PropTypes.object,
    values: _react.PropTypes.object,
    errors: _react.PropTypes.object,
    onSubmit: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    validateOpts: _react.PropTypes.object
};
JoiForm.childContextTypes = {
    joiForm: _react.PropTypes.object
};
JoiForm.defaultProps = {
    validateOpts: {},
    values: {},
    errors: {}
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.submit = function (e) {
        var _props3 = _this2.props,
            validateOpts = _props3.validateOpts,
            onSubmit = _props3.onSubmit;
        var _state = _this2.state,
            values = _state.values,
            schema = _state.schema;


        if (!onSubmit) return;
        if (e) e.preventDefault();

        _joiBrowser2.default.validate(values, schema, _extends({ abortEarly: false }, validateOpts), function (err, value) {
            if (err) {
                var errors = (0, _utils.reduce)(err.details, function (acc, n) {
                    return _extends({}, acc, _defineProperty({}, (0, _utils.camelize)(n.path), n.message));
                }, {});
                _this2.setState({ errors: errors }, function () {
                    return onSubmit(errors, values, e);
                });
                return;
            }
            onSubmit(null, values, e);
        });
    };

    this.__onChange = function (e, values) {
        var _e$target = e.target,
            name = _e$target.name,
            value = _e$target.value;

        var newState = { values: _this2.state.values };

        // update newState values with event values
        (0, _utils.reduce)((0, _utils.keys)(values), function (acc, valKey) {
            var isArrayKey = valKey.match(/([\w-]+)\[(\d+)\]/); // matches 'fieldname[1]' like keys
            if (isArrayKey) {
                var key = isArrayKey[1];
                var index = parseInt(isArrayKey[2]);
                acc.values[key][index] = values[valKey];
            } else {
                acc.values[valKey] = values[valKey];
            }
        }, newState);

        var onChange = _this2.props.onChange || _utils.noop;
        var _state2 = _this2.state,
            schema = _state2.schema,
            errors = _state2.errors;

        if (!errors || !errors[name]) {
            onChange(e, newState.values);
            _this2.setState(newState);
            return;
        }

        _joiBrowser2.default.validate(value, schema[name], function (err, value) {
            var formErrors = err ? (0, _utils.reduce)(err.details, function (acc, n) {
                return _extends({}, acc, _defineProperty({}, name, n.message));
            }, {}) : {};
            newState.errors = _extends({}, errors, formErrors);
            if (!err) delete newState.errors[name];
            onChange(e, newState.values);
            _this2.setState(newState);
        });
    };

    this.__onBlur = function (e) {
        var _e$target2 = e.target,
            name = _e$target2.name,
            value = _e$target2.value;
        var schema = _this2.state.schema;

        var onBlur = _this2.props.onBlur || _utils.noop;

        // Dont validate if the field is empty and not required
        if (value === "" && schema[name]._flags.presence !== "required") {
            onBlur(null, e);
            return;
        }

        _joiBrowser2.default.validate(value, schema[name], function (err, value) {
            if (!err) {
                onBlur(null, e);
                return;
            }
            var formErrors = (0, _utils.reduce)(err.details, function (acc, n) {
                return _extends({}, acc, _defineProperty({}, name, n.message));
            }, {});
            _this2.setState({ errors: _extends({}, _this2.state.errors, formErrors) }, function () {
                return onBlur(formErrors[name], e);
            });
        });
    };

    this.__onFocus = function (e) {
        var handler = _this2.props.onFocus || _utils.noop;
        handler(e);
    };
};

exports.default = JoiForm;