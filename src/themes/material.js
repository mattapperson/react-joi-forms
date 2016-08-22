import TextField from 'material-ui/lib/TextField';
import SelectField from 'material-ui/lib/Select';
import Checkbox from 'material-ui/lib/Checkbox';
import RadioButtonGroup from 'material-ui/lib/RadioButtonGroup';
import RadioButton from 'material-ui/lib/RadioButton';
import DatePicker from 'material-ui/lib/DatePicker';
import Toggle from 'material-ui/lib/Toggle';

const components = {
  textComponent: (err, value, options, events) => {
    const key = options.key;
    delete options.key;

    if(options.type === 'date') {
      return (
        <div key={key} className={err ? 'input-error' : 'input-no-error'}>
          <br />
          <DatePicker fullWidth
                      hintText={options.label}
                      {...options}
                      value={value}
                      errorText={err}
                      onChange={(err, date) => {
                        const e = {
                          preventDefault: () => {},
                          target: { name: options.name, value: date }
                        };
                        events.onChange(e);
                        events.onBlur(e);
                      }} />
        </div>
      )
    }

    return (
      <div key={key} className={err ? 'input-error' : 'input-no-error'}>
        <TextField fullWidth
          floatingLabelText={options.label}

          {...options}
          type={options.type}
          value={value}
          errorText={err}
          onChange={events.onChange}
          onFocus={events.onFocus}
          onBlur={events.onBlur} />
      </div>
    )
  },
  selectComponent: (err, value, options, events) => {
    const { key, enums } = options;
    delete options.enums
    delete options.key;

    const selectOptions = Object.keys(enums).map((option, i) => ({ payload:option, text:  enums[option] }));
    return (
      <div key={key} className={err ? 'input-error' : 'input'}>
        <SelectField fullWidth={true}
                      floatingLabelText={options.label}
                      menuItems={selectOptions}
                      value={value}
                      errorText={err}
                      onChange={(err, index) => {
                        const e = {
                          preventDefault: () => {},
                          target: { name: options.name, value: selectOptions[index].payload }
                        };
                        events.onChange(e);
                        events.onBlur(e);
                      }} />
      </div>
    );
  },
  textAreaComponent: (err, value, options, events) => {
    const key = options.key;
    delete options.key;

    return (
      <div key={key} className={err ? 'input-error' : 'input'}>
        <TextField fullWidth
                    floatingLabelText={options.label}
                    multiLine
                    {...options}
                    value={value}
                    errorText={err}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur} />
      </div>
    )
  },
  checkboxComponent: (err, value, options, events) => {
    const type = options.type || 'checkbox';
    const key = options.key;
    delete options.key;

    let Component;
    switch(type) {
      case 'checkbox': Component = Checkbox; break;
      case 'toggle': Component = Toggle; break;
    }

    const handler = (err, checked) => {
      const e = {
          preventDefault: () => {},
          target: { name: options.name, value: checked }
      };
      events.onChange(e);
      events.onBlur(e);
    };

    return (
      <div key={key} className={err ? 'input-error' : 'input'}>
        <br />
        <Component label={options.label}
                    {...options}
                    value={value || options.default}
                    onToggle={handler}
                    onCheck={handler} />
      </div>
    );
  },
  fileComponent: (err, value, options, events) => {
    const key = options.key;
    delete options.key;

    return (
      <div key={key} className={err ? 'input-error' : 'input'}>
          {err}
          <input {...options}
                 type='file'
                 onChange={events.onChange}
                 onFocus={events.onFocus}
                 onBlur={events.onBlur} />
      </div>
    );
  }
}

export default components;
