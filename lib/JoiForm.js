'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _FormSection = require('./FormSection');

var _FormSection2 = _interopRequireDefault(_FormSection);

var _utils = require('./utils');

var _lodashIsequal = require('lodash.isequal');

var _lodashIsequal2 = _interopRequireDefault(_lodashIsequal);

var _themesHtml5 = require('./themes/html5');

var array = _react.PropTypes.array;
var object = _react.PropTypes.object;
var func = _react.PropTypes.func;
var bool = _react.PropTypes.bool;

var JoiForm = (function (_Component) {
  _inherits(JoiForm, _Component);

  _createClass(JoiForm, null, [{
    key: 'propTypes',
    value: {
      schema: array.isRequired,
      values: object,
      errors: object,
      controlled: bool,
      onSubmit: func,
      onChange: func,
      onSelect2Search: func,
      onAutocompleteSearch: func,
      prevDefault: bool,
      validateOpts: object,
      textComponent: func,
      selectComponent: func,
      select2Component: func,
      textAreaComponent: func,
      radioComponent: func,
      checkboxComponent: func,
      fileComponent: func,
      formComponent: func,
      autocompleteComponent: func
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      joiForm: object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: _extends({
      validateOpts: {},
      prevDefault: true,
      values: {},
      errors: {}
    }, _themesHtml5.components),
    enumerable: true
  }]);

  function JoiForm(props) {
    var _this = this;

    _classCallCheck(this, JoiForm);

    _get(Object.getPrototypeOf(JoiForm.prototype), 'constructor', this).call(this, props);

    this.submit = function (e) {
      var _props = _this.props;
      var validateOpts = _props.validateOpts;
      var onSubmit = _props.onSubmit;
      var prevDefault = _props.prevDefault;
      var _state = _this.state;
      var values = _state.values;
      var schema = _state.schema;

      if (!onSubmit) return;
      if (prevDefault && e) e.preventDefault();

      _joi2['default'].validate(values, schema, _extends({ abortEarly: false }, validateOpts), function (err, value) {
        if (err) {
          var _ret = (function () {
            var errors = (0, _utils.reduce)(err.details, function (acc, n) {
              return _extends({}, acc, _defineProperty({}, (0, _utils.camelize)(n.path), n.message));
            }, {});
            _this.setState({ errors: errors }, function () {
              return onSubmit(errors, null, e);
            });
            return {
              v: undefined
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
        onSubmit(null, values, e);
      });
    };

    this.__onChange = function (e, values) {
      var _e$target = e.target;
      var name = _e$target.name;
      var value = _e$target.value;

      var newState = { values: _this.state.values };
      var controlled = _this.props.controlled;

      // update newState values with event values
      (0, _utils.reduce)((0, _utils.keys)(values), function (acc, valKey) {
        var isArrayKey = valKey.match(/([\w-]+)\[(\d+)\]/); // matches 'fieldname[1]' like keys
        if (isArrayKey) {
          var key = isArrayKey[1];
          var index = parseInt(isArrayKey[2]);
          acc.values[key][index] = values[valKey];
        } else {
          acc.values[valKey] = values[valKey];
        }
      }, newState);

      var onChange = _this.props.onChange || _utils.noop;
      var _state2 = _this.state;
      var schema = _state2.schema;
      var errors = _state2.errors;

      if (!errors || !errors[name]) {
        if (controlled) {
          // don't update values in the state
          onChange(e, newState.values);
          return;
        } else {
          _this.setState(newState, function () {
            return onChange(e, newState.values);
          });
        }
      }

      _joi2['default'].validate(value, schema[name], function (err, value) {
        var formErrors = err ? (0, _utils.reduce)(err.details, function (acc, n) {
          return _extends({}, acc, _defineProperty({}, name, n.message));
        }, {}) : {};
        newState.errors = _extends({}, errors, formErrors);
        if (!err) delete newState.errors[name];
        if (controlled) {
          // don't update values in the state
          _this.setState({ errors: newState.errors }, function () {
            return onChange(e, newState.values);
          });
        } else {
          _this.setState(newState, function () {
            return onChange(e, newState.values);
          });
        }
      });
    };

    this.__onSelect2Search = function (e, change) {
      var handler = _this.props.onSelect2Search || _utils.noop;
      handler(e, change);
    };

    this.__onFocus = function (e) {
      var handler = _this.props.onFocus || _utils.noop;
      handler(e);
    };

    this.__onAutocompleteSearch = function (searchText, dataSource) {
      var handler = _this.props.onAutocompleteSearch || _utils.noop;
      handler(searchText, dataSource);
    };

    this.__onBlur = function (e) {
      var _e$target2 = e.target;
      var name = _e$target2.name;
      var value = _e$target2.value;
      var schema = _this.state.schema;

      var onBlur = _this.props.onBlur || _utils.noop;

      // Dont validate if the field is empty and not required
      if (value === '' && schema[name]._flags.presence !== 'required') {
        onBlur(e);
        return;
      }

      _joi2['default'].validate(value, schema[name], function (err, value) {
        if (!err) {
          onBlur(e);
          return;
        }
        var formErrors = (0, _utils.reduce)(err.details, function (acc, n) {
          return _extends({}, acc, _defineProperty({}, name, n.message));
        }, {});
        _this.setState({ errors: _extends({}, _this.state.errors, formErrors) }, function () {
          return onBlur(e);
        });
      });
    };

    this.__getErrors = function (fieldName) {
      var data = _this.state.errors;
      return fieldName ? data && data[fieldName] : data;
    };

    this.__getValue = function (fieldName) {
      var data = _this.state.values;
      return fieldName ? data && data[fieldName] : data;
    };

    var state = {};

    var _props$schema = props.schema;
    var schema = _props$schema === undefined ? [] : _props$schema;
    var values = props.values;
    var errors = props.errors;

    state.schema = (0, _utils.reduce)(schema, function (acc, x) {
      var meta = (0, _utils.merge)(x._meta);
      return _extends({}, acc, _defineProperty({}, meta.name || (0, _utils.camelize)(x._flags.label), x));
    }, {});
    state.errors = errors;
    state.values = _extends({}, (0, _utils.defaultValues)(schema, values), values);
    this.state = state;
  }

  _createClass(JoiForm, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _props2 = this.props;
      var schema = _props2.schema;
      var prevDefault = _props2.prevDefault;
      var validateOpts = _props2.validateOpts;
      var textComponent = _props2.textComponent;
      var selectComponent = _props2.selectComponent;
      var select2Component = _props2.select2Component;
      var textAreaComponent = _props2.textAreaComponent;
      var radioComponent = _props2.radioComponent;
      var checkboxComponent = _props2.checkboxComponent;
      var fileComponent = _props2.fileComponent;
      var formComponent = _props2.formComponent;
      var autocompleteComponent = _props2.autocompleteComponent;

      return {
        joiForm: {
          getValue: this.__getValue,
          getErrors: this.__getErrors,
          onChange: this.__onChange,
          onSelect2Search: this.__onSelect2Search,
          onFocus: this.__onFocus,
          onBlur: this.__onBlur,
          onAutocompleteSearch: this.__onAutocompleteSearch,

          schema: schema,
          prevDefault: prevDefault,
          validateOpts: validateOpts,
          textComponent: textComponent,
          selectComponent: selectComponent,
          select2Component: select2Component,
          textAreaComponent: textAreaComponent,
          radioComponent: radioComponent,
          checkboxComponent: checkboxComponent,
          fileComponent: fileComponent,
          formComponent: formComponent,
          autocompleteComponent: autocompleteComponent
        }
      };
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var controlled = this.props.controlled;

      var schemasEqual = nextState.schema === this.state.schema;
      var valuesEqual = (0, _lodashIsequal2['default'])(nextState.values, this.state.values);

      // if controlled = true -> rerender
      // if controlled = false -> rerender if values changed or schema changed
      if (controlled) return true;
      return !schemasEqual || !valuesEqual;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var schema = (0, _utils.reduce)(nextProps.schema, function (acc, x) {
        var meta = (0, _utils.merge)(x._meta);
        return _extends({}, acc, _defineProperty({}, meta.name || (0, _utils.camelize)(x._flags.label), x));
      }, {});
      if (this.props.controlled) {
        var values = _extends({}, this.state.values, nextProps.values);
        var errors = _extends({}, this.state.errors, nextProps.errors);
        this.setState(_extends({}, this.state, { schema: schema, values: values, errors: errors }));
      } else {
        this.setState(_extends({}, this.state, { schema: schema }));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var children = _props3.children;
      var inline = _props3.inline;

      var childNodes = children || _react2['default'].createElement(_FormSection2['default'], null);
      var onSubmit = this.submit;
      var vnode = inline ? _react2['default'].createElement(
        'div',
        null,
        childNodes
      ) : _react2['default'].createElement(
        'form',
        { onSubmit: onSubmit },
        childNodes
      );
      return vnode;
    }
  }]);

  return JoiForm;
})(_react.Component);

exports['default'] = JoiForm;
module.exports = exports['default'];