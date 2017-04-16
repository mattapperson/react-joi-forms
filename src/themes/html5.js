import React from "react";
const components = {
    text: (options, events) => {
        const key = options.key;
        delete options.key;

        return (
            <div
                key={key}
                className={options.error ? "input-error" : "input-no-error"}>
                {options.label &&
                    <div><span>{options.label}:</span><br /></div>}
                <input
                    {...options}
                    type={options.type}
                    value={options.value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
                {options.error &&
                    <div>
                        <span style={{ color: "red" }}>{options.error}</span>
                    </div>}
            </div>
        );
    },
    select: (options, events) => {
        const { key, allowed } = options;
        delete options.enums;
        delete options.key;
        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.label &&
                    <div><span>{options.label}:</span><br /></div>}
                <select
                    value={options.value}
                    {...options}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}>
                    {Object.keys(allowed).map(option => {
                        return (
                            <option key={option} value={option}>
                                {allowed[option]}
                            </option>
                        );
                    })}
                </select>
                {options.error &&
                    <div>
                        <span style={{ color: "red" }}>{options.error}</span>
                    </div>}

            </div>
        );
    },
    textArea: (options, events) => {
        const key = options.key;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.label &&
                    <div><span>{options.label}:</span><br /></div>}
                <textarea
                    {...options}
                    value={options.value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
                {options.error &&
                    <div>
                        <span style={{ color: "red" }}>{options.error}</span>
                    </div>}
            </div>
        );
    },
    checkbox: (options, events) => {
        options.type = "checkbox";
        const key = options.key;
        delete options.key;
        console.log(options.inputValue);
        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.label &&
                    <div><span>{options.label}:</span><br /></div>}
                <input
                    {...options}
                    value={options.value}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
                {options.error &&
                    <div>
                        <span style={{ color: "red" }}>{options.error}</span>
                    </div>}
            </div>
        );
    },
    file: (options, events) => {
        options.type = "file";
        const key = options.key;
        delete options.key;

        return (
            <div key={key} className={options.error ? "input-error" : "input"}>
                {options.label &&
                    <div><span>{options.label}:</span><br /></div>}
                <input
                    {...options}
                    onChange={events.onChange}
                    onFocus={events.onFocus}
                    onBlur={events.onBlur}
                />
                {options.error &&
                    <div>
                        <span style={{ color: "red" }}>{options.error}</span>
                    </div>}

            </div>
        );
    }
};

export default components;
