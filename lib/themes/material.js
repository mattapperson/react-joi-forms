'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUiLibTextField = require('material-ui/lib/text-field');

var _materialUiLibTextField2 = _interopRequireDefault(_materialUiLibTextField);

var _materialUiLibSelectField = require('material-ui/lib/select-field');

var _materialUiLibSelectField2 = _interopRequireDefault(_materialUiLibSelectField);

var _materialUiLibCheckbox = require('material-ui/lib/checkbox');

var _materialUiLibCheckbox2 = _interopRequireDefault(_materialUiLibCheckbox);

var _materialUiLibRadioButtonGroup = require('material-ui/lib/radio-button-group');

var _materialUiLibRadioButtonGroup2 = _interopRequireDefault(_materialUiLibRadioButtonGroup);

var _materialUiLibRadioButton = require('material-ui/lib/radio-button');

var _materialUiLibRadioButton2 = _interopRequireDefault(_materialUiLibRadioButton);

var _materialUiLibDatePicker = require('material-ui/lib/date-picker');

var _materialUiLibToggle = require('material-ui/lib/toggle');

var _materialUiLibToggle2 = _interopRequireDefault(_materialUiLibToggle);

var components = {
  textComponent: function textComponent(err, value, options, events) {
    var key = options.key;
    delete options.key;

    if (options.type === 'date') {
      return _react2['default'].createElement(
        'div',
        { key: key, className: err ? 'input-error' : 'input-no-error' },
        _react2['default'].createElement('br', null),
        _react2['default'].createElement(_materialUiLibDatePicker.DatePicker, _extends({ fullWidth: true,
          hintText: options.label
        }, options, {
          value: value,
          errorText: err,
          onChange: function (err, date) {
            var e = {
              preventDefault: function preventDefault() {},
              target: { name: options.name, value: date }
            };
            events.onChange(e);
            events.onBlur(e);
          } }))
      );
    }

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input-no-error' },
      _react2['default'].createElement(_materialUiLibTextField2['default'], _extends({ fullWidth: true,
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
    var key = options.key;
    var _options$enums = options.enums;
    var enums = _options$enums === undefined ? {} : _options$enums;

    delete options.enums;
    delete options.key;

    var selectOptions = Object.keys(enums).map(function (option, i) {
      return { payload: option, text: enums[option] };
    });
    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      _react2['default'].createElement(_materialUiLibSelectField2['default'], { fullWidth: true,
        floatingLabelText: options.label,
        menuItems: selectOptions,
        value: value,
        errorText: err,
        onChange: function (err, index) {
          var e = {
            preventDefault: function preventDefault() {},
            target: { name: options.name, value: selectOptions[index].payload }
          };
          events.onChange(e);
          events.onBlur(e);
        } })
    );
  },
  textAreaComponent: function textAreaComponent(err, value, options, events) {
    var key = options.key;
    delete options.key;

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      _react2['default'].createElement(_materialUiLibTextField2['default'], _extends({ fullWidth: true,
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
    var type = options.type || 'checkbox';
    var key = options.key;
    delete options.key;

    var Component = undefined;
    switch (type) {
      case 'checkbox':
        Component = _materialUiLibCheckbox2['default'];break;
      case 'toggle':
        Component = _materialUiLibToggle2['default'];break;
    }

    var handler = function handler(err, checked) {
      var e = {
        preventDefault: function preventDefault() {},
        target: { name: options.name, value: checked }
      };
      events.onChange(e);
      events.onBlur(e);
    };

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      _react2['default'].createElement('br', null),
      _react2['default'].createElement(Component, _extends({ label: options.label
      }, options, {
        value: value || options['default'],
        onToggle: handler,
        onCheck: handler }))
    );
  },
  fileComponent: function fileComponent(err, value, options, events) {
    var key = options.key;
    delete options.key;

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      _react2['default'].createElement('input', _extends({}, options, {
        type: 'file',
        onChange: events.onChange,
        onFocus: events.onFocus,
        onBlur: events.onBlur }))
    );
  }
};

exports['default'] = components;
module.exports = exports['default'];