'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Joi = require('joi');

var FormSection = React.createClass({
    displayName: 'FormSection',

    // Cant be used until we get 0.14.x
    contextTypes: {
        joiForm: React.PropTypes.object
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

        var context = this.context.joiForm;
        var fields;

        if (this.props.tag === undefined) fields = context.schema; // if no tag is passed as prop, sections display everything

        else if (context.schema && this.props.tag) {
                fields = context.schema.filter(function (field) {
                    return field._tags.indexOf(_this.props.tag) !== -1;
                });
                if (fields.length < 1) fields = null; // if tag does not match tag(s) in schema, render nothing
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

                var fieldComponent = fieldSchema._meta.component || 'text';
                var fieldName = fieldSchema._meta.name || _this._camelize(fieldSchema._settings.language.label);
                var optionNames, optionValues;

                if (fieldComponent === 'select') {
                    if (!fieldSchema._valids || !fieldSchema._valids._set || !fieldSchema._valids._set.length === 0) {
                        return console.error(fieldName + ' is a select component but no \'valid\' params are provided, field is ignored');
                    }
                }

                if (fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length > 0) {
                    optionValues = fieldSchema._meta.names || fieldSchema._valids._set;
                    optionNames = fieldSchema._valids._set;
                }

                var options = _extends({}, fieldSchema._meta, {
                    required: fieldSchema._flags.presence === 'required',
                    name: fieldName,
                    label: fieldSchema._settings.language.label,
                    key: fieldName,
                    allowed: optionValues,
                    'default': fieldSchema._flags ? fieldSchema._flags['default'] : undefined
                });

                switch (fieldComponent) {
                    case 'text':
                        options.placeholder = fieldSchema._examples[0] || undefined;
                        break;
                    case 'select':
                    case 'select2':
                        options.enums = _this.makeObject(optionNames, optionValues);
                        break;
                    case 'checkbox':

                        break;
                    case 'textArea':

                        break;
                    case 'file':

                        break;
                }

                if (!context[fieldComponent + 'Component']) {
                    console.error('[JoiForm Error] The requested input type of ' + fieldComponent + ' does not have a defined component');
                    return React.createElement(
                        'span',
                        null,
                        'Input type ',
                        fieldComponent,
                        ' does not have a defined component type'
                    );
                }

                return context[fieldComponent + 'Component'](context.getErrors(fieldName), context.getValue(fieldName), options, {
                    onChange: _this.__onChange,
                    onSelect2Search: _this.__onSelect2Search,
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
    __onChange: function __onChange(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        var context = this.context.joiForm;

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
    __onSelect2Search: function __onSelect2Search(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        var context = this.context.joiForm;

        if (context.onSelect2Search) {
            var change = {};
            change[e.target.name] = e.target.value;

            context.onSelect2Search(e, change);
        }
    },
    __onFocus: function __onFocus(e) {
        var context = this.context.joiForm;

        if (context.onFocus) {
            context.onFocus(e);
        }
    },
    __onBlur: function __onBlur(e) {
        var context = this.context.joiForm;

        if (context.onBlur) {
            context.onBlur(e);
        }
    }
});

module.exports = FormSection;