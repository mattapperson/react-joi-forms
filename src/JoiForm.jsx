var React = require('react');
var Joi = require('joi');
var FormSection = require('./FormSection');

var JoiForm = React.createClass({
    propTypes: {
        schema: React.PropTypes.array,
        values: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        onChange: React.PropTypes.func,
        textComponent: React.PropTypes.func,
        selectComponent: React.PropTypes.func,
        textAreaComponent: React.PropTypes.func,
        radioComponent: React.PropTypes.func,
        checkboxComponent: React.PropTypes.func,
        fileComponent: React.PropTypes.func
    },
    childContextTypes: {
        joiForm: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            joiForm: {
                schema: this.props.schema,
                getValue: this.__getValue,
                getErrors: this.__getErrors,
                onChange: this.__onChange,
                onFocus: this.__onFocus,
                onBlur: this.__onBlur,
                textComponent: this.props.textComponent,
                selectComponent: this.props.selectComponent,
                textAreaComponent: this.props.textAreaComponent,
                radioComponent: this.props.radioComponent,
                checkboxComponent: this.props.checkboxComponent,
                fileComponent: this.props.fileComponent
            }
        };
    },
    makeObject(list, values) {
        if (!list) return {};
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            result[list[i]] = values[i];
        }
        return result;
    },
    getDefaultProps() {
        return {
            values: {},
            textComponent: (err, value, options, events) => {
                var key = options.key;
                delete options.key;

                return (
                    <div key={key} className={err ? 'input-error' : 'input-no-error'}>
                        {err}
                        <input {...options}
                               type={options.type}
                               value={value}
                               onChange={events.onChange}
                               onFocus={events.onFocus}
                               onBlur={events.onBlur} />
                    </div>
                )
            },
            selectComponent: (err, value, options, events) => {
                var enums = options.enums;
                delete options.enums
                var key = options.key;
                delete options.key;

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <select value={value} {...options}>
                            {Object.keys(enums).map((option) => {
                                return (
                                    <option key={option} value={option}>{enums[option]}</option>
                                );

                            })}
                        </select>
                    </div>
                );
            },
            textAreaComponent: (err, value, options, events) => {
                var key = options.key;
                delete options.key;

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <textarea {...options}
                                  value={value}
                                  onChange={events.onChange}
                                  onFocus={events.onFocus}
                                  onBlur={events.onBlur} ></textarea>
                    </div>
                )
            },
            checkboxComponent: (err, value, options, events) => {
                options.type = 'checkbox';
                var key = options.key;
                delete options.key;

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <input {...options}
                               value={value}
                               onChange={events.onChange}
                               onFocus={events.onFocus}
                               onBlur={events.onBlur} />
                    </div>
                );
            },
            fileComponent: (err, value, options, events) => {
                options.type = 'file';
                var key = options.key;
                delete options.key;

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <input {...options}
                               onChange={events.onChange}
                               onFocus={events.onFocus}
                               onBlur={events.onBlur} />
                    </div>
                );
            }
        };
    },
    shouldComponentUpdate(nextProps, nextState) {

        // dont re-render for schema state change, all others still should
        return nextState.schema === this.state.schema;
    },
    componentDidMount() {
        var schema = {};
        if(this.props.schema) {
            this.props.schema.forEach((fieldSchema) => {
                schema[fieldSchema._meta.name || this._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }

        this.setState({
            ...this.state,
            schema: schema
        });
    },
    getInitialState() {
        var state = {
            schema: {},
            values: this.props.values
        };

        if(this.props.schema) {
            this.props.schema.forEach((fieldSchema) => {

                var name = fieldSchema._meta.name || this._camelize(fieldSchema._settings.language.label);

                // if no value set for this field, but their is a default, set it
                if(state.values[name] === undefined && fieldSchema._flags.default !== undefined) {
                    state.values[name] = fieldSchema._flags.default;
                }
                if(state.values[name] === undefined && fieldSchema._type === 'boolean') {
                    state.values[name] = false;
                }
            });
        }
        return state;
    },
    _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    componentWillReceiveProps(nextProps) {
        var schema = {};
        if(nextProps.schema) {
            nextProps.schema.forEach((fieldSchema) => {
                schema[this._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }

        this.setState({
            ...this.state,
            schema: schema
        });
    },
    render() {

        if(this.props.children) {
            return (
                <form onSubmit={this.submit}>
                    {this.props.children}
                </form>
            )
        }

        return (
            <form onSubmit={this.submit}>
                <FormSection />
            </form>
        )
    },

    submit() {
        if(!this.props.onSubmit) return;

        Joi.validate(this.state.values, this.state.schema, {abortEarly: false}, (err, value) => {
            if(err) {
                var formErrors= {};
                err.details.forEach((inputError) => {
                    formErrors[this._camelize(inputError.path)] = inputError.message;
                })

                this.setState({
                    errors: formErrors
                }, () => {
                    this.props.onSubmit(formErrors);
                });
                return;
            }
            this.props.onSubmit(null, this.state.values);
        });

    },
    _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    __onChange(e, values) {
        var name = e.target.name;
        var value = e.target.value;

        var newState = {
            values: {
                ...this.state.values,
                ...values
            },
        };

        if(this.state.errors && this.state.errors[name]) {
            Joi.validate(value, this.state.schema[name], (err, value) => {
                if(err) {
                    var formErrors= {};
                    err.details.forEach((inputError) => {
                        formErrors[this._camelize(inputError.path)] = inputError.message;
                    });

                    newState.errors = {...this.state.errors, ...formErrors};

                    this.setState(newState, () => {
                        if(this.props.onChange) {
                            this.props.onChange(e, newState.values);
                        }
                    });
                } else {

                    newState.errors = {...this.state.errors};
                    delete newState.errors[name];

                    this.setState(newState, () => {
                        if(this.props.onChange) {
                            this.props.onChange(e, newState.values);
                        }
                    });
                }
            });
        } else {
            this.setState(newState, () => {
                if(this.props.onChange) {
                    this.props.onChange(e, newState.values);
                }
            });
        }

    },
    __onFocus(e) {
        if(this.props.onFocus) {
            this.props.onFocus(e);
        }
    },
    __onBlur(e) {
        var value = e.target.value;
        var name = e.target.name;

        // Dont validate if the field is empty and not required
        if(typeof value === 'string' && value.length === 0 && this.state.schema[name]._flags.presence !== 'required') {
            if(this.props.onBlur) {
                this.props.onBlur(e);
            }
            return;
        }

        Joi.validate(value, this.state.schema[name], (err, value) => {
            if(err) {
                var formErrors= {};
                err.details.forEach((inputError) => {
                    formErrors[this._camelize(inputError.path)] = inputError.message;
                })

                this.setState({
                    errors: {...this.state.errors, ...formErrors}
                }, () => {
                    if(this.props.onBlur) {
                        this.props.onBlur(e);
                    }
                });
            } else {
                if(this.props.onBlur) {
                    this.props.onBlur(e);
                }
            }
        });
    },
    __getErrors(fieldName) {
        if(fieldName) {
            var errors = this.state.errors || {};
            return errors[fieldName]
        }

        return this.state.errors;
    },
    __getValue(fieldName) {
        if(fieldName) {
            var values = this.state.values || {};
            return values[fieldName]
        }

        return this.state.values;
    }
});

module.exports = JoiForm;
