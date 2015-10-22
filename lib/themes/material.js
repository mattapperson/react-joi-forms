'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var _require = require('material-ui');

var TextField = _require.TextField;
var SelectField = _require.SelectField;
var Checkbox = _require.Checkbox;
var RadioButtonGroup = _require.RadioButtonGroup;
var RadioButton = _require.RadioButton;
var DatePicker = _require.DatePicker;
var Toggle = _require.Toggle;

module.exports = {
    textComponent: function textComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        if (options.type === 'date') {
            return React.createElement(
                'div',
                { key: key, className: err ? 'input-error' : 'input-no-error' },
                React.createElement('br', null),
                React.createElement(DatePicker, _extends({ fullWidth: true,
                    hintText: options.label
                }, options, {
                    value: value,
                    errorText: err,
                    onChange: function (err, date) {
                        var e = {
                            preventDefault: function preventDefault() {},
                            target: {
                                name: options.name,
                                value: date
                            }
                        };
                        events.onChange(e);
                        events.onBlur(e);
                    } }))
            );
        }

        return React.createElement(
            'div',
            { key: key, className: err ? 'input-error' : 'input-no-error' },
            React.createElement(TextField, _extends({ fullWidth: true,
                floatingLabelText: options.label

            }, options, {
                type: options.type,
                value: value,
                errorText: err,
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

        var selectOptions = Object.keys(enums).map(function (option, i) {
            return {
                payload: option,
                text: enums[option]
            };
        });
        return React.createElement(
            'div',
            { key: key, className: err ? 'input-error' : 'input' },
            React.createElement(SelectField, { fullWidth: true,
                floatingLabelText: options.label,
                menuItems: selectOptions,
                value: value,
                errorText: err,
                onChange: function (err, index) {
                    var e = {
                        preventDefault: function preventDefault() {},
                        target: {
                            name: options.name,
                            value: selectOptions[index].payload
                        }
                    };
                    events.onChange(e);
                    events.onBlur(e);
                } })
        );
    },
    textAreaComponent: function textAreaComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        return React.createElement(
            'div',
            { key: key, className: err ? 'input-error' : 'input' },
            React.createElement(TextField, _extends({ fullWidth: true,
                floatingLabelText: options.label,
                multiLine: true
            }, options, {
                value: value,
                errorText: err,
                onChange: events.onChange,
                onFocus: events.onFocus,
                onBlur: events.onBlur }))
        );
    },
    checkboxComponent: function checkboxComponent(err, value, options, events) {
        var type = type = options.type || 'checkbox';
        var key = options.key;
        delete options.key;
        var Component;

        switch (type) {
            case 'checkbox':
                Component = Checkbox;break;
            case 'toggle':
                Component = Toggle;break;
        }

        return React.createElement(
            'div',
            { key: key, className: err ? 'input-error' : 'input' },
            React.createElement('br', null),
            React.createElement(Component, _extends({ label: options.label
            }, options, {
                value: value || options['default'],
                onToggle: function (err, checked) {
                    var e = {
                        preventDefault: function preventDefault() {},
                        target: {
                            name: options.name,
                            value: checked
                        }
                    };
                    events.onChange(e);
                    events.onBlur(e);
                },
                onCheck: function (err, checked) {
                    var e = {
                        preventDefault: function preventDefault() {},
                        target: {
                            name: options.name,
                            value: checked
                        }
                    };
                    events.onChange(e);
                    events.onBlur(e);
                } }))
        );
    },
    fileComponent: function fileComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        return React.createElement(
            'div',
            { key: key, className: err ? 'input-error' : 'input' },
            err,
            React.createElement('input', _extends({}, options, {
                type: 'file',
                onChange: events.onChange,
                onFocus: events.onFocus,
                onBlur: events.onBlur }))
        );
    }
};