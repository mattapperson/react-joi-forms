'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Joi = require('joi');
var FormSection = require('./FormSection');

var JoiForm = React.createClass({
    displayName: 'JoiForm',

    propTypes: {
        schema: React.PropTypes.array,
        values: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        onChange: React.PropTypes.func,
        textComponent: React.PropTypes.func,
        selectComponent: React.PropTypes.func,
        textAreaComponent: React.PropTypes.func,
        radioComponent: React.PropTypes.func,
        checkboxComponent: React.PropTypes.func,
        fileComponent: React.PropTypes.func
    },
    childContextTypes: {
        joiForm: React.PropTypes.object
    },
    getChildContext: function getChildContext() {
        return {
            joiForm: {
                schema: this.props.schema,
                getValue: this.__getValue,
                getErrors: this.__getErrors,
                onChange: this.__onChange,
                onFocus: this.__onFocus,
                onBlur: this.__onBlur,
                textComponent: this.props.textComponent,
                selectComponent: this.props.selectComponent,
                textAreaComponent: this.props.textAreaComponent,
                radioComponent: this.props.radioComponent,
                checkboxComponent: this.props.checkboxComponent,
                fileComponent: this.props.fileComponent
            }
        };
    },
    makeObject: function makeObject(list, values) {
        if (!list) return {};
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            result[list[i]] = values[i];
        }
        return result;
    },
    getDefaultProps: function getDefaultProps() {
        return {
            values: {},
            textComponent: function textComponent(err, value, options, events) {
                var key = options.key;
                delete options.key;

                return React.createElement(
                    'div',
                    { key: key, className: err ? 'input-error' : 'input-no-error' },
                    err,
                    React.createElement('input', _extends({}, options, {
                        type: options.type,
                        value: value,
                        onChange: events.onChange,
                        onFocus: events.onFocus,
                        onBlur: events.onBlur }))
                );
            },
            selectComponent: function selectComponent(err, value, options, events) {
                var enums = options.enums;
                delete options.enums;
                var key = options.key;
                delete options.key;

                return React.createElement(
                    'div',
                    { key: key, className: err ? 'input-error' : 'input' },
                    err,
                    React.createElement(
                        'select',
                        _extends({ value: value }, options),
                        Object.keys(enums).map(function (option) {
                            return React.createElement(
                                'option',
                                { key: option, value: option },
                                enums[option]
                            );
                        })
                    )
                );
            },
            textAreaComponent: function textAreaComponent(err, value, options, events) {
                var key = options.key;
                delete options.key;

                return React.createElement(
                    'div',
                    { key: key, className: err ? 'input-error' : 'input' },
                    err,
                    React.createElement('textarea', _extends({}, options, {
                        value: value,
                        onChange: events.onChange,
                        onFocus: events.onFocus,
                        onBlur: events.onBlur }))
                );
            },
            checkboxComponent: function checkboxComponent(err, value, options, events) {
                options.type = 'checkbox';
                var key = options.key;
                delete options.key;

                return React.createElement(
                    'div',
                    { key: key, className: err ? 'input-error' : 'input' },
                    err,
                    React.createElement('input', _extends({}, options, {
                        value: value,
                        onChange: events.onChange,
                        onFocus: events.onFocus,
                        onBlur: events.onBlur }))
                );
            },
            fileComponent: function fileComponent(err, value, options, events) {
                options.type = 'file';
                var key = options.key;
                delete options.key;

                return React.createElement(
                    'div',
                    { key: key, className: err ? 'input-error' : 'input' },
                    err,
                    React.createElement('input', _extends({}, options, {
                        onChange: events.onChange,
                        onFocus: events.onFocus,
                        onBlur: events.onBlur }))
                );
            }
        };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {

        // dont re-render for schema state change, all others still should
        return nextState.schema === this.state.schema;
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        var schema = {};
        if (this.props.schema) {
            this.props.schema.forEach(function (fieldSchema) {
                schema[fieldSchema._meta.name || _this._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }

        this.setState(_extends({}, this.state, {
            schema: schema
        }));
    },
    getInitialState: function getInitialState() {
        var _this2 = this;

        var state = {
            schema: {},
            values: this.props.values
        };

        if (this.props.schema) {
            this.props.schema.forEach(function (fieldSchema) {

                var name = fieldSchema._meta.name || _this2._camelize(fieldSchema._settings.language.label);

                // if no value set for this field, but their is a default, set it
                if (state.values[name] === undefined && fieldSchema._flags['default'] !== undefined) {
                    state.values[name] = fieldSchema._flags['default'];
                }
                if (state.values[name] === undefined && fieldSchema._type === 'boolean') {
                    state.values[name] = false;
                }
            });
        }
        return state;
    },
    _camelize: function _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var _this3 = this;

        var schema = {};
        if (nextProps.schema) {
            nextProps.schema.forEach(function (fieldSchema) {
                schema[_this3._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }

        this.setState(_extends({}, this.state, {
            schema: schema
        }));
    },
    render: function render() {

        if (this.props.children) {
            return React.createElement(
                'form',
                { onSubmit: this.submit },
                this.props.children
            );
        }

        return React.createElement(
            'form',
            { onSubmit: this.submit },
            React.createElement(FormSection, null)
        );
    },

    submit: function submit(e) {
        var _this4 = this;

        if (!this.props.onSubmit) return;

        Joi.validate(this.state.values, this.state.schema, { abortEarly: false }, function (err, value) {
            if (err) {
                var formErrors = {};
                err.details.forEach(function (inputError) {
                    formErrors[_this4._camelize(inputError.path)] = inputError.message;
                });

                _this4.setState({
                    errors: formErrors
                }, function () {
                    _this4.props.onSubmit(formErrors, null, e);
                });
                return;
            }
            _this4.props.onSubmit(null, _this4.state.values, e);
        });
    },
    _camelize: function _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    __onChange: function __onChange(e, values) {
        var _this5 = this;

        var name = e.target.name;
        var value = e.target.value;

        var newState = {
            values: _extends({}, this.state.values, values)
        };

        if (this.state.errors && this.state.errors[name]) {
            Joi.validate(value, this.state.schema[name], function (err, value) {
                if (err) {
                    var formErrors = {};
                    err.details.forEach(function (inputError) {
                        formErrors[_this5._camelize(inputError.path)] = inputError.message;
                    });

                    newState.errors = _extends({}, _this5.state.errors, formErrors);

                    _this5.setState(newState, function () {
                        if (_this5.props.onChange) {
                            _this5.props.onChange(e, newState.values);
                        }
                    });
                } else {

                    newState.errors = _extends({}, _this5.state.errors);
                    delete newState.errors[name];

                    _this5.setState(newState, function () {
                        if (_this5.props.onChange) {
                            _this5.props.onChange(e, newState.values);
                        }
                    });
                }
            });
        } else {
            this.setState(newState, function () {
                if (_this5.props.onChange) {
                    _this5.props.onChange(e, newState.values);
                }
            });
        }
    },
    __onFocus: function __onFocus(e) {
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    },
    __onBlur: function __onBlur(e) {
        var _this6 = this;

        var value = e.target.value;
        var name = e.target.name;

        // Dont validate if the field is empty and not required
        if (typeof value === 'string' && value.length === 0 && this.state.schema[name]._flags.presence !== 'required') {
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
            return;
        }

        Joi.validate(value, this.state.schema[name], function (err, value) {
            if (err) {
                var formErrors = {};
                err.details.forEach(function (inputError) {
                    formErrors[_this6._camelize(inputError.path)] = inputError.message;
                });

                _this6.setState({
                    errors: _extends({}, _this6.state.errors, formErrors)
                }, function () {
                    if (_this6.props.onBlur) {
                        _this6.props.onBlur(e);
                    }
                });
            } else {
                if (_this6.props.onBlur) {
                    _this6.props.onBlur(e);
                }
            }
        });
    },
    __getErrors: function __getErrors(fieldName) {
        if (fieldName) {
            var errors = this.state.errors || {};
            return errors[fieldName];
        }

        return this.state.errors;
    },
    __getValue: function __getValue(fieldName) {
        if (fieldName) {
            var values = this.state.values || {};
            return values[fieldName];
        }

        return this.state.values;
    }
});

module.exports = JoiForm;