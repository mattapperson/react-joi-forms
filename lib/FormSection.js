'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Joi = require('joi');

var FormSection = React.createClass({
    displayName: 'FormSection',

    // Cant be used until we get 0.14.x
    // contextTypes: {
    //     schema: React.PropTypes.array,
    //     values: React.PropTypes.object,
    //     onChange: React.PropTypes.func,
    //     textComponent: React.PropTypes.func,
    //     selectComponent: React.PropTypes.func,
    //     textAreaComponent: React.PropTypes.func,
    //     radioComponent: React.PropTypes.func,
    //     checkboxComponent: React.PropTypes.func,
    //     fileComponent: React.PropTypes.func
    // },

    // This is here to support react 0.13.x
    parentContext: function parentContext() {
        return this._reactInternalInstance._context;
    },
    makeObject: function makeObject(list, values) {
        if (!list) return {};
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            result[list[i]] = values[i];
        }
        return result;
    },
    render: function render() {
        var _this = this;

        var context = this.parentContext().joiForm;
        var fields;

        if (context.schema) {
            fields = context.schema.filter(function (field) {
                return field._tags.indexOf(_this.props.tag) !== -1;
            });
            if (fields.length < 1) fields = context.schema; // if no tags, sections display everything
        }

        return React.createElement(
            'div',
            null,
            fields && fields.map(function (fieldSchema) {
                if (!fieldSchema.isJoi) {
                    throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
                }
                if (!fieldSchema._settings.language || !fieldSchema._settings.language.label) {
                    throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
                }

                if (fieldSchema._meta.length > 0) {
                    fieldSchema._meta = _this._merge(fieldSchema._meta);
                }

                // Order of setting fieldType:
                // 1: default to 'text'
                // 2: Use switch statment to alter that based on fields schema
                // 3: Allow override of defaults
                var fieldType = _this._getFieldType(fieldSchema);
                var fieldName = fieldSchema._meta.name || _this._camelize(fieldSchema._settings.language.label);
                var optionNames, optionValues;

                if (fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length > 0) {
                    optionValues = fieldSchema._meta.names || fieldSchema._valids._set;
                    optionNames = fieldSchema._valids._set;
                    fieldType = 'select';
                }

                var options = _extends({}, fieldSchema._meta, {
                    required: fieldSchema._flags.presence === 'required',
                    name: fieldName,
                    label: fieldSchema._settings.language.label,
                    key: fieldName,
                    'default': fieldSchema._flags ? fieldSchema._flags['default'] : undefined
                });

                switch (fieldType) {
                    case 'text':
                        options.placeholder = fieldSchema._examples[0] || undefined;

                        options.masks = [].concat(fieldSchema._meta.masks || []);
                        if (fieldSchema._type === 'date' && options.masks[0] !== 'time') {
                            options.masks.push('date');
                        } else if (fieldSchema._type === 'date') {
                            options.masks.push('time');
                        }
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
                        options.enums = _this.makeObject(optionNames, optionValues);
                        break;
                    case 'checkbox':
                        options.masks = [].concat(fieldSchema._meta.masks || []);
                        if (options.mask) {
                            options.masks.push(options.mask);
                            delete options.mask;
                        }
                        break;
                    case 'textArea':

                        break;
                    case 'file':

                        break;
                }

                if (!context[fieldType + "Component"]) {
                    console.error('[JoiForm Error] The requested input type of ' + fieldType + ' does not have a defined component');
                    return React.createElement(
                        'span',
                        null,
                        'Input type ',
                        fieldType,
                        ' does not have a defined component type'
                    );
                }

                return context[fieldType + "Component"](context.getErrors(fieldName), context.getValue(fieldName), options, {
                    onChange: _this.__onChange,
                    onFocus: _this.__onFocus,
                    onBlur: _this.__onBlur
                });
            })
        );
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

        var context = this.parentContext().joiForm;

        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        var values = {};
        if (files) {
            values[e.target.name] = files;
        } else {
            values[e.target.name] = e.target.value;
        }

        if (context.onChange) {
            var change = {};
            change[e.target.name] = values[e.target.name];

            context.onChange(e, change);
        }
    },
    __onFocus: function __onFocus(e) {
        var context = this.parentContext().joiForm;

        if (context.onFocus) {
            context.onFocus(e);
        }
    },
    __onBlur: function __onBlur(e) {
        var context = this.parentContext().joiForm;

        if (context.onBlur) {
            context.onBlur(e);
        }
    }
});

module.exports = FormSection;