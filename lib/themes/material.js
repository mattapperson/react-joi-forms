"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _TextField = require("material-ui/TextField");

var _TextField2 = _interopRequireDefault(_TextField);

var _SelectField = require("material-ui/SelectField");

var _SelectField2 = _interopRequireDefault(_SelectField);

var _Checkbox = require("material-ui/Checkbox");

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _RadioButton = require("material-ui/RadioButton");

var _DatePicker = require("material-ui/DatePicker");

var _Toggle = require("material-ui/Toggle");

var _Toggle2 = _interopRequireDefault(_Toggle);

var _AutoComplete = require("material-ui/AutoComplete");

var _AutoComplete2 = _interopRequireDefault(_AutoComplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var components = {
    textComponent: function textComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        if (options.type === "date") {
            return _react2.default.createElement(
                "div",
                {
                    key: key,
                    className: err ? "input-error" : "input-no-error" },
                _react2.default.createElement("br", null),
                _react2.default.createElement(_DatePicker.DatePicker, _extends({
                    fullWidth: true,
                    hintText: options.label
                }, options, {
                    value: value,
                    errorText: err,
                    onChange: function onChange(err, date) {
                        var e = {
                            preventDefault: function preventDefault() {},
                            target: { name: options.name, value: date }
                        };
                        events.onChange(e);
                        events.onBlur(e);
                    }
                }))
            );
        }

        return _react2.default.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input-no-error" },
            _react2.default.createElement(_TextField2.default, _extends({
                fullWidth: true,
                floatingLabelText: options.label
            }, options, {
                type: options.type,
                value: value,
                errorText: err,
                onChange: events.onChange,
                onFocus: events.onFocus,
                onBlur: events.onBlur
            }))
        );
    },
    selectComponent: function selectComponent(err, value, options, events) {
        var key = options.key,
            _options$enums = options.enums,
            enums = _options$enums === undefined ? {} : _options$enums;

        delete options.enums;
        delete options.key;

        var selectOptions = Object.keys(enums).map(function (option, i) {
            return {
                payload: option,
                text: enums[option]
            };
        });
        return _react2.default.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            _react2.default.createElement(_SelectField2.default, {
                fullWidth: true,
                floatingLabelText: options.label,
                menuItems: selectOptions,
                value: value,
                errorText: err,
                onChange: function onChange(err, index) {
                    var e = {
                        preventDefault: function preventDefault() {},
                        target: {
                            name: options.name,
                            value: selectOptions[index].payload
                        }
                    };
                    events.onChange(e);
                    events.onBlur(e);
                }
            })
        );
    },
    textAreaComponent: function textAreaComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        return _react2.default.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            _react2.default.createElement(_TextField2.default, _extends({
                fullWidth: true,
                floatingLabelText: options.label,
                multiLine: true
            }, options, {
                value: value,
                errorText: err,
                onChange: events.onChange,
                onFocus: events.onFocus,
                onBlur: events.onBlur
            }))
        );
    },
    checkboxComponent: function checkboxComponent(err, value, options, events) {
        var type = options.type || "checkbox";
        var key = options.key;
        delete options.key;

        var Component = void 0;
        switch (type) {
            case "checkbox":
                Component = _Checkbox2.default;
                break;
            case "toggle":
                Component = _Toggle2.default;
                break;
        }

        var handler = function handler(err, checked) {
            var e = {
                preventDefault: function preventDefault() {},
                target: { name: options.name, value: checked }
            };
            events.onChange(e);
            events.onBlur(e);
        };

        return _react2.default.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            _react2.default.createElement("br", null),
            _react2.default.createElement(Component, _extends({
                label: options.label
            }, options, {
                value: value || options.default,
                onToggle: handler,
                onCheck: handler
            }))
        );
    },
    fileComponent: function fileComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        return _react2.default.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            err,
            _react2.default.createElement("input", _extends({}, options, {
                type: "file",
                onChange: events.onChange,
                onFocus: events.onFocus,
                onBlur: events.onBlur
            }))
        );
    },
    autocompleteComponent: function autocompleteComponent(err, value, options, events) {
        var label = options.label,
            dataSource = options.dataSource,
            dataSourceConfig = options.dataSourceConfig;

        var onNewRequestHandler = function onNewRequestHandler(chosenRequest, index) {
            var e = {
                preventDefault: function preventDefault() {},
                target: {
                    name: options.name || options.label,
                    value: chosenRequest,
                    index: index
                }
            };
            events.onChange(e);
        };

        var onUpdateInputHandler = function onUpdateInputHandler(searchText, dataSource) {
            events.onAutocompleteSearch(searchText, options.name);
        };

        return _react2.default.createElement(
            "div",
            { className: err ? "input-error" : "input" },
            err,
            _react2.default.createElement(_AutoComplete2.default, {
                floatingLabelText: label,
                filter: _AutoComplete2.default.noFilter,
                openOnFocus: true,
                fullWidth: true,
                dataSource: dataSource,
                onNewRequest: function onNewRequest(chosenRequest, index) {
                    return onNewRequestHandler(chosenRequest);
                },
                onUpdateInput: onUpdateInputHandler,
                dataSourceConfig: dataSourceConfig
            })
        );
    }
};

exports.default = components;