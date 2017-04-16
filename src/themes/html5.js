import React from "react";
const components = {
    text: (options, events) => {
        const key = options.key;
        delete options.key;

        return (
            <div
                key={key}
                className={options.error ? "input-error" : "input-no-error"}>
                {options.error}
                <input
                    {...options}
                    type={options.type}
                    value={options.value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
            </div>
        );
    },
    select: (options, events) => {
        const { key, enums } = options;
        delete options.enums;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.error}
                <select value={value} {...options}>
                    {Object.keys(enums).map(option => {
                        return (
                            <option key={option} value={option}>
                                {enums[option]}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    },
    textArea: (options, events) => {
        const key = options.key;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.error}
                <textarea
                    {...options}
                    value={value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
            </div>
        );
    },
    checkbox: (options, events) => {
        options.type = "checkbox";
        const key = options.key;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.error}
                <input
                    {...options}
                    value={value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
            </div>
        );
    },
    file: (options, events) => {
        options.type = "file";
        const key = options.key;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.error}
                <input
                    {...options}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
            </div>
        );
    }
};

export default components;
