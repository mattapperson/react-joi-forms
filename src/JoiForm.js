var React = require('react');
var Joi = require('joi');
var FormSection = require('./FormSection.js');

var Form = React.createClass({
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
                values: this.props.values,
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
                var type = 'text';
                if(['password', 'date', 'email'].indexOf(options.masks[0]) !== -1) {
                    type = options.masks[0];
                }

                delete options.masks;
                var key = options.key;
                delete options.key;

                return (
                    <div key={key}>
                        {err}
                        <input {...options}
                               type={type}
                               id={err ? 'error' : 'noError'}
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
                schema[this._camelize(fieldSchema._settings.language.label)] = fieldSchema;
            });
        }
        this.setState({
            ...this.state,
            schema: schema
        });
    },
    getInitialState() {
        let props = (this.props.children) ? this.props.children.props : this.props;

        return {
            schema: {},
            values:{}
        };
    },
    componentWillReceiveProps() {
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
                    formErrors[inputError.path] = inputError.message;
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
        var newState = {
            values: {
                ...this.state.values,
                ...values
            },
        };
        this.setState(newState);

        if(this.props.onChange) {
            this.props.onChange(e, newState.values);
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

        Joi.validate(value, this.state.schema[name], (err, value) => {
            if(err) {
                this.setState({
                    errors: {...this.state.errors, err}
                });
            }

            if(this.props.onBlur) {
                this.props.onBlur(e);
            }
        });
    },
    __getErrors(fieldName) {
        if(fieldName) {
            var errors = this.state.errors || {};
            return errors[fieldName]
        }

        return this.state.errors;
    }
});

module.exports = Form;
