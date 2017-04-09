import React, { Component, PropTypes } from "react";
import Joi from "joi-browser";
import FormSection from "./FormSection";
import { merge, camelize, reduce, keys, noop, defaultValues } from "./utils";
import isEqual from "lodash.isequal";

class JoiForm extends Component {
    static propTypes = {
        schema: PropTypes.object,
        values: PropTypes.object,
        errors: PropTypes.object,
        onSubmit: PropTypes.func,
        onChange: PropTypes.func,
        validateOpts: PropTypes.object
    };

    static childContextTypes = {
        joiForm: PropTypes.object
    };

    static defaultProps = {
        validateOpts: {},
        values: {},
        errors: {}
    };

    constructor(props) {
        super(props);
        let state = {};

        const { schema = {}, values, errors } = props;

        state.schema = schema;
        state.errors = errors;
        state.values = { ...defaultValues(schema, values), ...values };
        this.state = state;
    }

    getChildContext() {
        const {
            schema,
            validateOpts,
            textComponent,
            selectComponent,
            textAreaComponent,
            radioComponent,
            checkboxComponent,
            fileComponent,
            formComponent,
            autocompleteComponent
        } = this.props;

        return {
            joiForm: {
                values: this.state.values,
                errors: this.state.errors,
                onChange: this.__onChange,
                onFocus: this.__onFocus,
                onBlur: this.__onBlur,

                schema,
                validateOpts,
                textComponent,
                selectComponent,
                textAreaComponent,
                radioComponent,
                checkboxComponent,
                fileComponent,
                formComponent,
                autocompleteComponent
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        const schema = nextProps.schema;
        const isNextValuesEmpty = keys(nextProps.values).length === 0;
        const values = isNextValuesEmpty
            ? {}
            : { ...this.state.values, ...nextProps.values };
        const errors = { ...this.state.errors, ...nextProps.errors };
        this.setState({ ...this.state, schema, values, errors });
    }

    render() {
        const { children, inline } = this.props;
        const childNodes = children || <FormSection />;
        const onSubmit = this.submit;

        const vnode = inline
            ? <div>{childNodes}</div>
            : <form onSubmit={onSubmit}>{childNodes}</form>;
        return vnode;
    }

    submit = e => {
        const { validateOpts, onSubmit } = this.props;
        const { values, schema } = this.state;

        if (!onSubmit) return;
        if (e) e.preventDefault();

        Joi.validate(
            values,
            schema,
            { abortEarly: false, ...validateOpts },
            (err, value) => {
                if (err) {
                    const errors = reduce(
                        err.details,
                        (acc, n) => ({ ...acc, [camelize(n.path)]: n.message }),
                        {}
                    );
                    this.setState({ errors }, () =>
                        onSubmit(errors, values, e));
                    return;
                }
                onSubmit(null, values, e);
            }
        );
    };

    __onChange = (e, values) => {
        const { name, value } = e.target;
        const newState = { values: this.state.values };

        // update newState values with event values
        reduce(
            keys(values),
            (acc, valKey) => {
                const isArrayKey = valKey.match(/([\w-]+)\[(\d+)\]/); // matches 'fieldname[1]' like keys
                if (isArrayKey) {
                    const key = isArrayKey[1];
                    const index = parseInt(isArrayKey[2]);
                    acc.values[key][index] = values[valKey];
                } else {
                    acc.values[valKey] = values[valKey];
                }
            },
            newState
        );

        const onChange = this.props.onChange || noop;
        const { schema, errors } = this.state;
        if (!errors || !errors[name]) {
            onChange(e, newState.values);
            this.setState(newState);
            return;
        }

        Joi.validate(value, schema[name], (err, value) => {
            const formErrors = err
                ? reduce(
                      err.details,
                      (acc, n) => ({ ...acc, [name]: n.message }),
                      {}
                  )
                : {};
            newState.errors = { ...errors, ...formErrors };
            if (!err) delete newState.errors[name];
            onChange(e, newState.values);
            this.setState(newState);
        });
    };

    __onBlur = e => {
        const { name, value } = e.target;
        const { schema } = this.state;
        const onBlur = this.props.onBlur || noop;

        // Dont validate if the field is empty and not required
        if (value === "" && schema[name]._flags.presence !== "required") {
            onBlur(null, e);
            return;
        }

        Joi.validate(value, schema[name], (err, value) => {
            if (!err) {
                onBlur(null, e);
                return;
            }
            const formErrors = reduce(
                err.details,
                (acc, n) => ({ ...acc, [name]: n.message }),
                {}
            );
            this.setState(
                { errors: { ...this.state.errors, ...formErrors } },
                () => onBlur(formErrors[name], e)
            );
        });
    };

    __onFocus = e => {
        const handler = this.props.onFocus || noop;
        handler(e);
    };
}

export default JoiForm;
