var React = require('react');
var Joi = require('joi');
var FormSection = require('./FormSection.jsx');

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
            textComponent: (value, options, events) => {
                var mask = options.masks[0] || 'text'
                delete options.masks;

                return (
                    <input {...options}
                           type={mask}
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                )
            },
            selectComponent: (value, options, events) => {
                var enums = options.enums;
                delete options.enums

                return (
                    <select value={value} {...options}>
                        {Object.keys(enums).map((option) => {
                            return (
                                <option key={option} value={option}>{enums[option]}</option>
                            );

                        })}
                    </select>
                );
            },
            textAreaComponent: (value, options, events) => {
                return (
                    <textarea {...options}
                              value={value}
                              onChange={events.onChange}
                              onFocus={events.onFocus}
                              onBlur={events.onBlur} ></textarea>
                )
            },
            checkboxComponent: (value, options, events) => {
                options.type = 'checkbox';

                return (
                    <input {...options}
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                );
            },
            fileComponent: (value, options, events) => {
                options.type = 'file';

                return (
                    <input {...options}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
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

        Joi.validate(this.state.values, this.state.schema, (err, value) => {
            if(err) return this.props.onSubmit(err);

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
            }
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
    __onBlur() {
        if(this.props.onBlur) {
            this.props.onBlur(e);
        }
    }
});

module.exports = Form;
