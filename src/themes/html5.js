import React from 'react'
const components = {
  textComponent: (err, value, options, events) => {
    const key = options.key;
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
    const { key, enums } = options;
    delete options.enums
    delete options.key;

    return (
      <div key={key} className={err ? 'input-error' : 'input'}>
        {err}
        <select value={value} {...options}>
          {Object.keys(enums).map(option => {
            return ( <option key={option} value={option}>{enums[option]}</option> );
          })}
        </select>
      </div>
    );
  },
  textAreaComponent: (err, value, options, events) => {
    const key = options.key;
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
    const key = options.key;
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
    const key = options.key;
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

export default components;
