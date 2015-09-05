'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Joi = require('joi');

var Form = React.createClass({
    displayName: 'Form',

    propTypes: {
        schema: React.PropTypes.array,
        values: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        textComponent: React.PropTypes.func,
        selectComponent: React.PropTypes.func,
        textAreaComponent: React.PropTypes.func,
        radioComponent: React.PropTypes.func,
        checkboxComponent: React.PropTypes.func,
        fileComponent: React.PropTypes.func
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
            textComponent: function textComponent(value, options, events) {
                var mask = options.masks[0] || 'text';
                delete options.masks;

                return React.createElement('input', _extends({}, options, {
                    type: mask,
                    value: value,
                    onChange: events.onChange,
                    onFocus: events.onFocus,
                    onBlur: events.onBlur }));
            },
            selectComponent: function selectComponent(value, options, events) {
                var enums = options.enums;
                delete options.enums;

                return React.createElement(
                    'select',
                    _extends({ value: value }, options),
                    Object.keys(enums).map(function (option) {
                        return React.createElement(
                            'option',
                            { key: option, value: option },
                            enums[option]
                        );
                    })
                );
            },
            textAreaComponent: function textAreaComponent(value, options, events) {
                return React.createElement('textarea', _extends({}, options, {
                    value: value,
                    onChange: events.onChange,
                    onFocus: events.onFocus,
                    onBlur: events.onBlur }));
            },
            checkboxComponent: function checkboxComponent(value, options, events) {
                options.type = 'checkbox';

                return React.createElement('input', _extends({}, options, {
                    value: value,
                    onChange: events.onChange,
                    onFocus: events.onFocus,
                    onBlur: events.onBlur }));
            },
            fileComponent: function fileComponent(value, options, events) {
                options.type = 'file';

                return React.createElement('input', _extends({}, options, {
                    onChange: events.onChange,
                    onFocus: events.onFocus,
                    onBlur: events.onBlur }));
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
                schema[_this._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }
        this.setState(_extends({}, this.state, {
            schema: schema
        }));
    },
    getInitialState: function getInitialState() {
        var props = this.props.children ? this.props.children.props : this.props;

        return {
            schema: {},
            values: {}
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
        var _this2 = this;

        var schema = {};
        if (nextProps.schema) {
            nextProps.schema.forEach(function (fieldSchema) {
                schema[_this2._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }

        this.setState(_extends({}, this.state, {
            schema: schema
        }));
    },
    // checked
    // value
    // selected

    render: function render() {
        var _this3 = this;

        return React.createElement(
            'form',
            { onSubmit: this.submit },
            this.props.schema && this.props.schema.map(function (fieldSchema) {
                if (!fieldSchema.isJoi) {
                    throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
                }
                if (!fieldSchema._settings.language || !fieldSchema._settings.language.label) {
                    throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
                }

                if (fieldSchema._meta.length > 0) {
                    fieldSchema._meta = _this3._merge(fieldSchema._meta);
                }

                // Order of setting fieldType:
                // 1: default to 'text'
                // 2: Use switch statment to alter that based on fields schema
                // 3: Allow override of defaults
                var fieldType = _this3._getFieldType(fieldSchema);
                var fieldName = _this3._camelize(fieldSchema._settings.language.label);
                var optionNames, optionValues;

                if (fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length > 0) {
                    if (fieldSchema._meta && fieldSchema._meta.names) {
                        optionValues = fieldSchema._meta.names;
                        delete fieldSchema._meta.names;
                    } else {
                        optionValues = fieldSchema._valids._set;
                    }
                    optionNames = fieldSchema._valids._set;
                    fieldType = 'select';
                }

                var options = _extends({}, fieldSchema._meta, {
                    required: fieldSchema._flags.presence === 'required',
                    name: fieldName,
                    key: fieldName
                });

                switch (fieldType) {
                    case 'text':
                        options.placeholder = fieldSchema._examples[0] || undefined;

                        options.masks = [].concat(fieldSchema._meta.masks || []);
                        if (options.mask) {
                            options.masks.push(options.mask);
                            delete options.mask;
                        }

                        fieldSchema._tests.forEach(function (test) {
                            if (test.name) {
                                options.masks.push(test.name);
                            }
                        });
                        break;
                    case 'select':
                        options.enums = _this3.makeObject(optionNames, optionValues);
                        break;
                    case 'checkbox':

                        break;
                    case 'textArea':

                        break;
                    case 'file':

                        break;
                }

                if (!_this3.props[fieldType + "Component"]) {
                    console.error('[JoiForm Error] The requested input type of ' + fieldType + ' does not have a defined component');
                    return React.createElement(
                        'span',
                        null,
                        'Input type ',
                        fieldType,
                        ' does not have a defined component type'
                    );
                }

                return _this3.props[fieldType + "Component"](_this3.props.values[fieldName], options, {
                    onChange: _this3.__onChange,
                    onFocus: _this3.__onFocus,
                    onBlur: _this3.__onBlur
                });
            })
        );
    },

    submit: function submit() {
        var _this4 = this;

        Joi.validate(this.state.values, this.state.schema, function (err, value) {
            if (err) return _this4.props.onSubmit(err);

            _this4.props.onSubmit(null, _this4.state.values);
        });
    },
    _camelize: function _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    _merge: function _merge() {
        var objects = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var obj = {};
        objects.forEach(function (iObj) {
            Object.keys(iObj).forEach(function (key) {
                obj[key] = iObj[key];
            });
        });
        return obj;
    },
    _getFieldType: function _getFieldType(fieldSchema) {
        if (fieldSchema._meta && fieldSchema._meta.type) {
            return fieldSchema._meta.type;
        }

        if (fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length) {
            return 'select';
        }

        if (['array', 'boolean'].indexOf(fieldSchema._type) !== -1) {
            return 'checkbox';
        }

        return 'text';
    },
    __onChange: function __onChange(e) {
        e.preventDefault();

        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        var change = _extends({}, this.state);
        if (files) {
            change.values[e.target.name] = files;
        } else {
            change.values[e.target.name] = e.target.value;
        }
        this.setState(change);
        if (this.props.onChange) {
            this.props.onChange(change);
        }
    },
    __onFocus: function __onFocus() {},
    __onBlur: function __onBlur() {}
});

module.exports = Form;