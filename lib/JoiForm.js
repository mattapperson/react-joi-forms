import _defineProperty from "babel-runtime/helpers/defineProperty";
import _extends from "babel-runtime/helpers/extends";
import _Object$getPrototypeOf from "babel-runtime/core-js/object/get-prototype-of";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import React, { Component, PropTypes } from "react";
import Joi from "joi-browser";
import { merge, camelize, reduce, keys, noop, defaultValues } from "./utils";
import isEqual from "lodash.isequal";

var JoiForm = function (_Component) {
    _inherits(JoiForm, _Component);

    function JoiForm(props) {
        _classCallCheck(this, JoiForm);

        var _this = _possibleConstructorReturn(this, (JoiForm.__proto__ || _Object$getPrototypeOf(JoiForm)).call(this, props));

        _initialiseProps.call(_this);

        var state = {};

        var _props$schema = props.schema,
            schema = _props$schema === undefined ? {} : _props$schema,
            values = props.values,
            errors = props.errors;


        state.schema = schema;
        state.errors = errors;
        state.values = _extends({}, defaultValues(schema, values), values);
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
            var isNextValuesEmpty = keys(nextProps.values).length === 0;
            var values = isNextValuesEmpty ? {} : _extends({}, this.state.values, nextProps.values);

            this.setState(_extends({}, this.state, { schema: schema, values: values }));
        }
    }, {
        key: "render",
        value: function render() {
            var _props2 = this.props,
                children = _props2.children,
                inline = _props2.inline;

            var childNodes = children;
            var onSubmit = this.submit;

            var vnode = inline ? React.createElement(
                "div",
                null,
                childNodes
            ) : React.createElement(
                "form",
                { onSubmit: onSubmit },
                childNodes
            );
            return vnode;
        }
    }]);

    return JoiForm;
}(Component);

JoiForm.propTypes = {
    schema: PropTypes.object,
    values: PropTypes.object,
    errors: PropTypes.object,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    validateOpts: PropTypes.object
};
JoiForm.childContextTypes = {
    joiForm: PropTypes.object
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

        Joi.validate(values, schema, _extends({ abortEarly: false }, validateOpts), function (err, value) {
            if (err) {
                var errors = reduce(err.details, function (acc, n) {
                    return _extends({}, acc, _defineProperty({}, camelize(n.path), n.message));
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
        reduce(keys(values), function (acc, valKey) {
            var isArrayKey = valKey.match(/([\w-]+)\[(\d+)\]/); // matches 'fieldname[1]' like keys
            if (isArrayKey) {
                var key = isArrayKey[1];
                var index = parseInt(isArrayKey[2]);
                acc.values[key][index] = values[valKey];
            } else {
                acc.values[valKey] = values[valKey];
            }
        }, newState);

        var onChange = _this2.props.onChange || noop;
        var _state2 = _this2.state,
            schema = _state2.schema,
            errors = _state2.errors;

        if (!errors || !errors[name]) {
            onChange(e, newState.values);
            _this2.setState(newState);
            return;
        }

        Joi.validate(value, schema[name], function (err, value) {
            var formErrors = err ? reduce(err.details, function (acc, n) {
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

        var onBlur = _this2.props.onBlur || noop;

        // Dont validate if the field is empty and not required
        if (value === "" && schema[name]._flags.presence !== "required") {
            onBlur(null, e);
            return;
        }

        Joi.validate(value, schema[name], function (err, value) {
            if (!err) {
                onBlur(null, e);
                return;
            }
            var formErrors = reduce(err.details, function (acc, n) {
                return _extends({}, acc, _defineProperty({}, name, n.message));
            }, {});
            _this2.setState({ errors: _extends({}, _this2.state.errors, formErrors) }, function () {
                return onBlur(formErrors[name], e);
            });
        });
    };

    this.__onFocus = function (e) {
        var handler = _this2.props.onFocus || noop;
        handler(e);
    };
};

export default JoiForm;