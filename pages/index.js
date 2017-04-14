import React, { Component, PropTypes } from "react";
import { JoiForm, JoiInput, themes } from "../src/index";
import Joi from "joi-browser";
var injectTapEventPlugin = require("react-tap-event-plugin");

if (typeof window !== "undefined") {
    injectTapEventPlugin();
}

class Basic extends Component {
    getInitialState() {
        return {
            values: {},
            errors: {}
        };
    }

    constructor(props) {
        super(props);

        this.state = {};
    }

    submit() {
        this.refs.form.submit();
    }

    render() {
        return (
            <div>
                <JoiForm
                    ref="form"
                    schema={{
                        name: Joi.string()
                            .label("First Name")
                            .required()
                            .min(2),
                        password: Joi.string()
                            .label("Password")
                            .required()
                            .min(2),
                        surName: Joi.string()
                            .label("Last Name")
                            .valid(["Apperson", "Moseman"]),
                        bio: Joi.string().label("Bio").required(),
                        enabled: Joi.boolean().label("Enabled").required(),
                        disabled: Joi.boolean()
                            .label("Disabled")
                            .required()
                            .default(false),
                        startDate: Joi.date()
                            .label("Start Date")
                            .required()
                            .meta({ type: "date" }),
                        endTime: Joi.date()
                            .label("End Time")
                            .meta({ type: "time" })
                            .required(),
                        file: Joi.object()
                            .label("File Upload")
                            .meta({ component: "file" })
                    }}
                    values={this.state.values}
                    errors={this.state.errors}
                    controlled={true}
                    {...themes.material}
                    onChange={(e, formValues) => {
                        this.setState({ values: formValues });
                    }}
                    onSubmit={(e, formValues) => {}}>
                    <JoiInput name="name" />
                </JoiForm>
                <button onClick={this.submit}>Test</button>
            </div>
        );
    }
}

module.exports = Basic;
