import { Component, PropTypes } from 'react';
import Joi from 'joi';
import { merge, makeObject, camelize, getTaggedFields, assertSchema } from './utils';

const { object, string } = PropTypes;

const debug = console.error;

const __onChange = (handler) => (e) => {
  if (e.preventDefault) e.preventDefault();
  if (!handler) return;

  const name = e.target.name;
  const index = e.target.index;
  const value = e.target.value;
  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

  const pos = (index >= 0) ? '[' + index + ']' : '';
  const change = { [name+pos]: files || value };
  handler(e, change);
};

const __onSelect2Search = (handler) => (e) => {
  if (e.preventDefault) e.preventDefault();
  if (!handler) return;

  const name = e.target.name;
  const value = e.target.value;
  const change = { [e.target.name]: e.target.value };
  handler(e, change);
};

const __onEvent = (handler) => (e) => {
  if (handler) handler(e);
};

class FormSection extends Component ({
  static propTypes = {
    tag: string,
  };

  static contextTypes = {
    joiForm: object,
  };

  render() {
    const { tag } = this.props;
    const { joiForm: context } = this.context;
    const { schema, onChange, onSelect2Search, onFocus, onBlur } = context;

    const fields = (tag === undefined) ? schema : getTaggedFields(schema, tag);

    return (
      <div>
        {fields && fields.map((fieldSchema) => {
          assertSchema(fieldSchema);
          fieldSchema._meta = merge(fieldSchema._meta);

          const multiField = fieldSchema._meta.multi;
          const schemaForValids = multiField ? fieldSchema._inner.items[0] : fieldSchema;
          schemaForValids._meta = merge(schemaForValids._meta);

          const fieldComponent = fieldSchema._meta.component || 'text';
          const fieldName = fieldSchema._meta.name || this._camelize(fieldSchema._settings.language.label);

          const isEnumerated = (fieldComponent === 'select' || fieldComponent === 'select2');
          const hasValidsSet = schemaForValids._valids && schemaForValids._valids._set && schemaForValids._valids._set.length > 0;
          if (isEnumerated && !hasValidsSet) {
            debug(`${fieldName} is a ${fieldComponent} ${multiField ? 'with multiple values' : ''} component but no 'valid' params are provided, field is ignored`);
            return null;
          }

          let optionNames, optionValues;
          if(hasValidsSet) {
            optionValues = schemaForValids._meta.names || schemaForValids._valids._set;
            optionNames = schemaForValids._valids._set;
          }

          const options = {
            ...fieldSchema._meta,
            required: fieldSchema._flags.presence === 'required',
            name: fieldName,
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
            case 'select2':
              options.enums = this.makeObject(optionNames, optionValues);
            break;

            case 'form':
              options.formType = fieldSchema._type; // should be either object or array
              const schemaProvider = options.type === 'object'
                ? fieldSchema._inner.children // we get an array of [key, schema] as children for object items
                : fieldSchema._inner.items[0]._inner.children // we get an array of [key, schema] from the first valid item type of the array - that should be an object

              options.schema = schemaProvider.map(c => c.schema);
            break;
          }

          const fieldComponentCreator = context[`${fieldComponent}Component`];
          if(!fieldComponentCreator) {
            debug('[JoiForm Error] The requested input type of ' + fieldComponent + ' does not have a defined component');
            return ( <span>Input type {fieldComponent} does not have a defined component type</span> );
          }

          const fieldErrors = context.getErrors(fieldName);
          const fieldValue = context.getValue(fieldName);
          const fieldEvents = {
            onChange: __onChange(onChange),
            onSelect2Search: __onSelect2Search(onSelect2Search),
            onFocus: __onEvent(onFocus),
            onBlur: __onEvent(onBlur),
          };

          return fieldComponentCreator(fieldErrors, fieldValue, options, fieldEvents);
        })}
      </div>
    );
  },
})

export default FormSection;
