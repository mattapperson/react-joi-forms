'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var components = {
  textComponent: function textComponent(err, value, options, events) {
    var key = options.key;
    delete options.key;

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input-no-error' },
      err,
      _react2['default'].createElement('input', _extends({}, options, {
        type: options.type,
        value: value,
        onChange: events.onChange,
        onFocus: events.onFocus,
        onBlur: events.onBlur }))
    );
  },
  selectComponent: function selectComponent(err, value, options, events) {
    var key = options.key;
    var enums = options.enums;

    delete options.enums;
    delete options.key;

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      _react2['default'].createElement(
        'select',
        _extends({ value: value }, options),
        Object.keys(enums).map(function (option) {
          return _react2['default'].createElement(
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

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      _react2['default'].createElement('textarea', _extends({}, options, {
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

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      _react2['default'].createElement('input', _extends({}, options, {
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

    return _react2['default'].createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      _react2['default'].createElement('input', _extends({}, options, {
        onChange: events.onChange,
        onFocus: events.onFocus,
        onBlur: events.onBlur }))
    );
  }
};

exports['default'] = components;
module.exports = exports['default'];