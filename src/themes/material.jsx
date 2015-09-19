var React = require('react');
var {TextField,
    SelectField,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    DatePicker,
    Toggle} = require('material-ui');

module.exports = {
    textComponent: (err, value, options, events) => {
        var key = options.key;
        delete options.key;

        if(options.type === 'date') {
            return (
                <div key={key} className={err ? 'input-error' : 'input-no-error'}>
                    <br />
                    <DatePicker fullWidth={true}
                            hintText={options.label}
                            {...options}
                            value={value}
                            errorText={err}
                            onChange={(err, date) => {
                                var e = {
                                    preventDefault: () => {},
                                    target: {
                                        name: options.name,
                                        value: date
                                    }
                                };
                                events.onChange(e);
                                events.onBlur(e);
                            }} />
                </div>
            )
        }

        return (
            <div key={key} className={err ? 'input-error' : 'input-no-error'}>
                <TextField fullWidth={true}
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
        var enums = options.enums;
        delete options.enums
        var key = options.key;
        delete options.key;

        var selectOptions = Object.keys(enums).map((option, i) => {
            return {
                payload:option,
                text:  enums[option]
            };
        });
        return (
            <div key={key} className={err ? 'input-error' : 'input'}>
                <SelectField fullWidth={true}
                            floatingLabelText={options.label}
                            menuItems={selectOptions}
                            value={value}
                            errorText={err}
                            onChange={(err, index) => {
                                var e = {
                                    preventDefault: () => {},
                                    target: {
                                        name: options.name,
                                        value: selectOptions[index].payload
                                    }
                                };
                                events.onChange(e);
                                events.onBlur(e);
                            }} />
            </div>
        );
    },
    textAreaComponent: (err, value, options, events) => {
        var key = options.key;
        delete options.key;

        return (
            <div key={key} className={err ? 'input-error' : 'input'}>
                <TextField fullWidth={true}
                    floatingLabelText={options.label}
                    multiLine={true}
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
        var type = type = options.type || 'checkbox';
        var key = options.key;
        delete options.key;
        var Component;

        switch(type) {
            case 'checkbox': Component = Checkbox; break;
            case 'toggle': Component = Toggle; break;
        }

        return (
            <div key={key} className={err ? 'input-error' : 'input'}>
                <br />
                <Component label={options.label}
                        {...options}
                       value={value || options.default}
                       onToggle={(err, checked) => {
                           var e = {
                               preventDefault: () => {},
                               target: {
                                   name: options.name,
                                   value: checked
                               }
                           };
                           events.onChange(e);
                           events.onBlur(e);
                       }}
                       onCheck={(err, checked) => {
                           var e = {
                               preventDefault: () => {},
                               target: {
                                   name: options.name,
                                   value: checked
                               }
                           };
                           events.onChange(e);
                           events.onBlur(e);
                       }} />
            </div>
        );
    },
    fileComponent: (err, value, options, events) => {
        var key = options.key;
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
