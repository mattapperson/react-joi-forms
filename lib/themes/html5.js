import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
var components = {
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
    var key = options.key,
        enums = options.enums;

    delete options.enums;
    delete options.key;

    return React.createElement(
      'div',
      { key: key, className: err ? 'input-error' : 'input' },
      err,
      React.createElement(
        'select',
        _extends({ value: value }, options),
        _Object$keys(enums).map(function (option) {
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

export default components;