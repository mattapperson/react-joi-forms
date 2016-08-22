import { Component, PropTypes } from 'react';
import Joi from 'joi';
import FormSection from './FormSection';
import { merge, camelize, reduce, keys, noop } from './utils';

const { array, object, func, bool } = PropTypes;

class JoiForm extends Component {
  static propTypes = {
    schema: array.isRequired,
    values: object,
    onSubmit: func,
    onChange: func,
    onSelect2Search: func,
    prevDefault: bool,
    validateOpts: object,
    textComponent: func,
    selectComponent: func,
    select2Component: func,
    textAreaComponent: func,
    radioComponent: func,
    checkboxComponent: func,
    fileComponent: func,
    formComponent: func
  };

  static childContextTypes = {
    joiForm: object
  };

  getChildContext() {
    const {
      schema,
      prevDefault,
      validateOpts,
      textComponent,
      selectComponent,
      select2Component,
      textAreaComponent,
      radioComponent,
      checkboxComponent,
      fileComponent,
      formComponent,
    } = this.props;

    return {
      joiForm: {
        getValue: this.__getValue,
        getErrors: this.__getErrors,
        onChange: this.__onChange,
        onSelect2Search: this.__onSelect2Search,
        onFocus: this.__onFocus,
        onBlur: this.__onBlur,

        schema,
        prevDefault,
        validateOpts,
        textComponent,
        selectComponent,
        select2Component,
        textAreaComponent,
        radioComponent,
        checkboxComponent,
        fileComponent,
        formComponent,
      }
    };
  }

  getDefaultProps() {
    return {
      validateOpts: {},
      prevDefault: true,
      values: {},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // dont re-render for schema state change, all others still should
    // return nextState.schema === this.state.schema;
    // mehiel: WHY is the above correct / useful?
    return true;
  }

  componentDidMount() {
    const schema = reduce(schema, (acc, { _meta, _settings }) => {
      const meta = merge(_meta);
      const fieldName = meta.name || camelize(_settings.language.label);
      acc[fieldName] = fieldSchema;
    }, {});

    this.setState({ ...this.state, schema });
  }

  getInitialState() {
    const { schema = [], values } = this.props;
    const state = { schema: {}, values };

    schema.forEach((fieldSchema) => {
      const meta = merge(fieldSchema._meta);
      const name = meta.name || this._camelize(fieldSchema._settings.language.label);

      // if no value set for this field, but their is a default, set it
      const hasDefault = state.values[name] === undefined && fieldSchema._flags.default !== undefined;
      if (hasDefault) state.values[name] = fieldSchema._flags.default;

      // if no value set for this field, but is boolean, set it to false
      const setBoolean = state.values[name] === undefined && fieldSchema._type === 'boolean';
      if (setBoolean) state.values[name] = false;
    });

    return state;
  }

  componentWillReceiveProps(nextProps) {
    const nextSchema = nextProps.schema || [];

    // transform nextSchema to obj schema
    const schema = reduce(nextSchema, (acc, {_meta, _settings}) => {
        const meta = _meta[0] || _meta;
        const fieldName = meta.name || camelize(_settings.language.label);
        acc[fieldName] = fieldSchema;
      }, {});

    this.setState({ ...this.state, schema });
  }

  render() {
    const { children, inline } = this.props;
    const childNodes = ( children || <FormSection /> );
    const onSubmit = this.submit;
    const vnode = inline ? ( <div>{ childNodes }</div> ) : ( <form onSubmit={ onSubmit }>{ childNodes }</form> );
    return vnode;
  }

  submit(e) {
    const { validateOpts, onSubmit, prevDefault } = this.props;
    const { values, schema } = this.state;

    if(!onSubmit) return;
    if(prevDefault) e.preventDefault();

    Joi.validate(values, schema, {abortEarly: false, ...validateOpts}, (err, value) => {
      if(err) {
        const errors= reduce(err.details, (acc, { path, message }) => acc[camelize(path)] = message, {})
        this.setState({ errors }, () => onSubmit(errors, null, e));
        return;
      }
      onSubmit(null, values, e);
    });
  }

  __onChange(e, values) {
    const { name, value } = e.target;
    const newState = { values: this.state.values };

    // update newState values with event values
    reduce(keys(values), (acc, valKey) => {
      const isArrayKey = valKey.match(/([\w-]+)\[(\d+)\]/); // matches 'fieldname[1]' like keys
      if (isArrayKey) {
        const key = isArrayKey[1];
        const index = parseInt(isArrayKey[2]);
        acc.values[key][index] = values[valKey];
      } else {
        acc.values[k] = values[k];
      }
    }, newState);

    const onChange = this.props.onChange || noop;
    const { schema, errors } = this.state;
    if(!errors || !errors[name]) {
      this.setState(newState, () => onChange(e, newState.values));
      return;
    }

    Joi.validate(value, schema[name], (err, value) => {
      const formErrors = err ? reduce(err.details, (acc, { path, message }) => acc[camelize(path)] = message, {}) : {}
      newState.errors = { ...errors, ...formErrors };
      if (!err) delete newState.errors[name];
      this.setState(newState, () => onChange(e, newState.values));
    });
  }

  __onSelect2Search(e, change) {
    const handler = this.props.onSelect2Search || noop;
    handler(e, change);
  }

  __onFocus(e) {
    const handler = this.props.onFocus || noop;
    handler(e);
  }

  __onBlur(e) {
    const { name, value } = e.target;
    const { schema } = this.state;
    const onBlur = this.props.onBlur || noop;

    // Dont validate if the field is empty and not required
    if(value === '' && schema[name]._flags.presence !== 'required') {
      onBlur(e);
      return;
    }

    Joi.validate(value, schema[name], (err, value) => {
      if (!err) {
        onBlur(e);
        return;
      }

      const formErrors = reduce(err.details, (acc, { path, message }) => acc[camelize(path)] = message, {});
      this.setState({ errors: { ...errors, ...formErrors } }, () => onBlur(e));
    });
  }

  __getErrors(fieldName) {
    const data = this.state.errors;
    return (fieldName) ? data && data[fieldName] : data;
  }

  __getValue(fieldName) {
    const data = this.state.values;
    return (fieldName) ? data && data[fieldName] : data;
  }
}

export default JoiForm;
