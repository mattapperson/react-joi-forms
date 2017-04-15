"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _joiBrowser = require("joi-browser");

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

var _utils = require("./utils");

var _lodash = require("lodash.isequal");

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _html = require("./themes/html5");

var _html2 = _interopRequireDefault(_html);

var _reactnative = require("./themes/reactnative");

var _reactnative2 = _interopRequireDefault(_reactnative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Context = function (_Component) {
    _inherits(Context, _Component);

    function Context() {
        _classCallCheck(this, Context);

        return _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).apply(this, arguments));
    }

    _createClass(Context, [{
        key: "getChildContext",
        value: function getChildContext() {
            var _props = this.props,
                components = _props.components,
                fetchOptions = _props.fetchOptions,
                fetchHeaders = _props.fetchHeaders;


            return {
                joiFormGlobal: {
                    components: components,
                    fetchOptions: fetchOptions,
                    fetchHeaders: fetchHeaders
                }
            };
        }
    }, {
        key: "render",
        value: function render() {
            var children = this.props.children;


            return children;
        }
    }]);

    return Context;
}(_react.Component);

Context.propTypes = {
    components: _propTypes2.default.oneOf([_propTypes2.default.object, "material", "html5", "reactnative"]),
    fetchOptions: _propTypes2.default.object,
    fetchHeaders: _propTypes2.default.object
};
Context.childContextTypes = {
    joiFormGlobal: _propTypes2.default.object
};
Context.defaultProps = {
    components: _html2.default,
    fetchOptions: {},
    fetchHeaders: {}
};
exports.default = Context;