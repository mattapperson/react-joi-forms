import React, { Component } from "react";
import Joi from "joi-browser";
import { merge, camelize, reduce, keys, noop, defaultValues } from "./utils";
import isEqual from "lodash.isequal";
import PropTypes from "prop-types";
import html5 from "./themes/html5";
// import reactnative from "./themes/reactnative";

class Context extends Component {
    static propTypes = {
        components: PropTypes.oneOf([
            PropTypes.object,
            "material",
            "html5",
            "reactnative"
        ]),
        fetchOptions: PropTypes.object,
        fetchHeaders: PropTypes.object
    };

    static childContextTypes = {
        joiFormGlobal: PropTypes.object
    };

    static defaultProps = {
        components: html5,
        fetchOptions: {},
        fetchHeaders: {}
    };

    getChildContext() {
        const { components, fetchOptions, fetchHeaders } = this.props;

        return {
            joiFormGlobal: {
                components,
                fetchOptions,
                fetchHeaders
            }
        };
    }

    render() {
        const { children } = this.props;

        return children;
    }
}

export default Context;
