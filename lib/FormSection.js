'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _utils = require('./utils');

var object = _react.PropTypes.object;
var string = _react.PropTypes.string;

var debug = console.error;

var __onChange = function __onChange(handler) {
  return function (e) {
    if (e.preventDefault) e.preventDefault();
    if (!handler) return;

    var name = e.target.name;
    var index = e.target.index;
    var value = e.target.value;
    var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    var pos = index >= 0 ? '[' + index + ']' : '';
    var change = _defineProperty({}, name + pos, files || value);
    handler(e, change);
  };
};

var __onSelect2Search = function __onSelect2Search(handler) {
  return function (e) {
    if (e.preventDefault) e.preventDefault();
    if (!handler) return;

    var name = e.target.name;
    var value = e.target.value;
    var change = _defineProperty({}, e.target.name, e.target.value);
    handler(e, change);
  };
};

var __onAutocompleteSearch = function __onAutocompleteSearch(handler) {
  return function (searchText, dataSource) {
    if (handler) handler(searchText, dataSource);
  };
};

var __onEvent = function __onEvent(handler) {
  return function (e) {
    if (handler) handler(e);
  };
};

var FormSection = (function (_Component) {
  _inherits(FormSection, _Component);

  function FormSection() {
    _classCallCheck(this, FormSection);

    _get(Object.getPrototypeOf(FormSection.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FormSection, [{
    key: 'render',
    value: function render() {
      var tag = this.props.tag;
      var context = this.context.joiForm;
      var schema = context.schema;
      var onChange = context.onChange;
      var onSelect2Search = context.onSelect2Search;
      var onAutocompleteSearch = context.onAutocompleteSearch;
      var onFocus = context.onFocus;
      var onBlur = context.onBlur;

      var fields = tag === undefined ? schema : (0, _utils.getTaggedFields)(schema, tag);

      return _react2['default'].createElement(
        'div',
        null,
        fields && fields.map(function (fieldSchema) {
          (0, _utils.assertSchema)(fieldSchema);
          fieldSchema._meta = (0, _utils.merge)(fieldSchema._meta);

          var multiField = fieldSchema._meta.multi;
          var schemaForValids = multiField ? fieldSchema._inner.items[0] : fieldSchema;
          schemaForValids._meta = (0, _utils.merge)(schemaForValids._meta);

          var fieldComponent = fieldSchema._meta.component || 'text';
          var fieldName = fieldSchema._meta.name || (0, _utils.camelize)(fieldSchema._flags.label);

          var isEnumerated = fieldComponent === 'select' || fieldComponent === 'select2';
          var hasValidsSet = schemaForValids._valids && schemaForValids._valids._set && schemaForValids._valids._set.length > 0;
          if (isEnumerated && !hasValidsSet) {
            debug(fieldName + ' is a ' + fieldComponent + ' ' + (multiField ? 'with multiple values' : '') + ' component but no \'valid\' params are provided, field is ignored');
            return null;
          }

          var optionNames = undefined,
              optionValues = undefined;
          if (hasValidsSet) {
            optionValues = schemaForValids._meta.names || schemaForValids._valids._set;
            optionNames = schemaForValids._valids._set;
          }

          var options = _extends({}, fieldSchema._meta, {
            required: fieldSchema._flags.presence === 'required',
            name: fieldName,
            label: fieldSchema._flags.label,
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
              options.enums = (0, _utils.makeObject)(optionNames, optionValues);
              break;

            case 'form':
              options.formType = fieldSchema._type; // should be either object or array
              var schemaProvider = options.type === 'object' ? fieldSchema._inner.children // we get an array of [key, schema] as children for object items
              : fieldSchema._inner.items[0]._inner.children; // we get an array of [key, schema] from the first valid item type of the array - that should be an object

              options.schema = schemaProvider.map(function (c) {
                return c.schema;
              });
              break;
          }

          var fieldComponentCreator = context[fieldComponent + 'Component'];
          if (!fieldComponentCreator) {
            debug('[JoiForm Error] The requested input type of ' + fieldComponent + ' does not have a defined component');
            return _react2['default'].createElement(
              'span',
              null,
              'Input type ',
              fieldComponent,
              ' does not have a defined component type'
            );
          }

          var fieldErrors = context.getErrors(fieldName);
          var fieldValue = context.getValue(fieldName);
          var fieldEvents = {
            onChange: __onChange(onChange),
            onSelect2Search: __onSelect2Search(onSelect2Search),
            onAutocompleteSearch: __onAutocompleteSearch(onAutocompleteSearch),
            onFocus: __onEvent(onFocus),
            onBlur: __onEvent(onBlur)
          };

          return fieldComponentCreator(fieldErrors, fieldValue, options, fieldEvents);
        })
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      tag: string
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      joiForm: object
    },
    enumerable: true
  }]);

  return FormSection;
})(_react.Component);

;

exports['default'] = FormSection;
module.exports = exports['default'];