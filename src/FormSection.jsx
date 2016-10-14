var React = require('react');
var Joi = require('joi');

var FormSection = React.createClass({
    // Cant be used until we get 0.14.x
    contextTypes: {
        joiForm: React.PropTypes.object
    },

    makeObject(list, values) {
        if (!list) return {};
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            result[list[i]] = values[i];
        }
        return result;
    },
    render() {
        var context = this.context.joiForm;
        var fields;

        if(this.props.tag === undefined) fields = context.schema; // if no tag is passed as prop, sections display everything

        else if(context.schema && this.props.tag) {
            fields = context.schema.filter((field) => {
                return field._tags.indexOf(this.props.tag) !== -1;
            });
            if(fields.length < 1) fields = null; // if tag does not match tag(s) in schema, render nothing
        }

        return (
            <div>
                {fields && fields.map((fieldSchema) => {
                    if(!fieldSchema.isJoi) {
                        throw new Error('An array of Joi objects is what we expect for joi-react-forms.');
                    }
                    if(!fieldSchema._settings.language || !fieldSchema._settings.language.label) {
                        throw new Error('All joi-react-form elements MUST have a label or a name meta key/value');
                    }

                    if(fieldSchema._meta.length > 0) {
                        fieldSchema._meta = this._merge(fieldSchema._meta);
                    }

                    var fieldComponent = fieldSchema._meta.component || 'text';
                    var fieldName = fieldSchema._meta.name || this._camelize(fieldSchema._settings.language.label);
                    var optionNames, optionValues;

                    if(fieldComponent === 'select') {
                        if(!fieldSchema._valids || !fieldSchema._valids._set || !fieldSchema._valids._set.length === 0) {
                            return console.error(`${fieldName} is a select component but no 'valid' params are provided, field is ignored`);
                        }
                    }

                    if(fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length > 0) {
                        optionValues = fieldSchema._meta.names || fieldSchema._valids._set;
                        optionNames = fieldSchema._valids._set;
                    }

                    var options = {
                        ...fieldSchema._meta,
                        required: fieldSchema._flags.presence === 'required',
                        name: fieldName,
                        type: fieldSchema._type,
                        label: fieldSchema._settings.language.label,
                        key: fieldName,
                        allowed: optionValues,
                        default: fieldSchema._flags ? fieldSchema._flags.default : undefined
                    };

                    switch(fieldComponent) {
                        case 'text':
                            options.placeholder = fieldSchema._examples[0] || undefined;
                        break;
                        case 'select':
                            options.enums = this.makeObject(optionNames, optionValues);
                        break;
                        case 'checkbox':

                        break;
                        case 'textArea':

                        break;
                        case 'file':

                        break;
                    }

                    if(!context[`${fieldComponent}Component`]) {
                        console.error('[JoiForm Error] The requested input type of ' + fieldComponent + ' does not have a defined component');
                        return (
                            <span>Input type {fieldComponent} does not have a defined component type</span>
                        )
                    }

                    return context[`${fieldComponent}Component`](context.getErrors(fieldName), context.getValue(fieldName), options, {
                        onChange: this.__onChange,
                        onFocus: this.__onFocus,
                        onBlur: this.__onBlur
                    })
                })}
            </div>
        );
    },
    _camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    },
    _merge(objects = []) {
        var obj = {};
        objects.forEach((iObj) => {
            Object.keys(iObj).forEach((key) => {
                obj[key] = iObj[key];
            });
        });
        return obj;
    },
    __onChange(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }

        var context = this.context.joiForm;

        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        var values = {};
        if(files) {
            values[e.target.name] = files;
        } else {
            values[e.target.name] = e.target.value;
        }

        if(context.onChange) {
            var change = {};
            change[e.target.name] = values[e.target.name];

            context.onChange(e, change);
        }
    },
    __onFocus(e) {
        var context = this.context.joiForm;

        if(context.onFocus) {
            context.onFocus(e);
        }
    },
    __onBlur(e) {
        var context = this.context.joiForm;

        if(context.onBlur) {
            context.onBlur(e);
        }
    }
});

module.exports = FormSection;
