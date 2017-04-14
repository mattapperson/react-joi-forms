import _Object$keys from "babel-runtime/core-js/object/keys";
import _extends from "babel-runtime/helpers/extends";
import React from "react";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import Checkbox from "material-ui/Checkbox";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { DatePicker } from "material-ui/DatePicker";
import Toggle from "material-ui/Toggle";
import AutoComplete from "material-ui/AutoComplete";

var components = {
    textComponent: function textComponent(err, value, options, events) {
        var key = options.key;
        delete options.key;

        if (options.type === "date") {
            return React.createElement(
                "div",
                {
                    key: key,
                    className: err ? "input-error" : "input-no-error" },
                React.createElement("br", null),
                React.createElement(DatePicker, _extends({
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

        return React.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input-no-error" },
            React.createElement(TextField, _extends({
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

        var selectOptions = _Object$keys(enums).map(function (option, i) {
            return {
                payload: option,
                text: enums[option]
            };
        });
        return React.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            React.createElement(SelectField, {
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

        return React.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            React.createElement(TextField, _extends({
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
                Component = Checkbox;
                break;
            case "toggle":
                Component = Toggle;
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

        return React.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            React.createElement("br", null),
            React.createElement(Component, _extends({
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

        return React.createElement(
            "div",
            { key: key, className: err ? "input-error" : "input" },
            err,
            React.createElement("input", _extends({}, options, {
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

        return React.createElement(
            "div",
            { className: err ? "input-error" : "input" },
            err,
            React.createElement(AutoComplete, {
                floatingLabelText: label,
                filter: AutoComplete.noFilter,
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

export default components;