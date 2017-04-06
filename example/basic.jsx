import React from "react";
import { render } from "react-dom";
import { JoiForm, FormSection, themes } from "../src/index";
import Joi from "joi-browser";
var injectTapEventPlugin = require("react-tap-event-plugin");
var Inspector = require("react-json-inspector");

injectTapEventPlugin();

var Basic = React.createClass({
    getInitialState() {
        return {
            values: {},
            errors: {}
        };
    },

    joyStuff: [
        Joi.string().label("First Name").required().min(2),
        Joi.string()
            .label("Password")
            .meta({ type: "password", name: "password" })
            .required()
            .min(2),
        Joi.string()
            .label("Last Name")
            .valid(["Apperson", "Moseman"])
            .meta({ component: "select" }),
        Joi.string()
            .label("Complex Dropdown")
            .valid(["Matt", "Andy"])
            .meta({
                component: "select",
                names: ["Matt Apperson", "Andy Moseman"]
            }),
        Joi.string().label("Bio").meta({ component: "textArea" }).required(),
        Joi.boolean()
            .label("Enabled")
            .meta({ component: "checkbox", type: "toggle" })
            .required(),
        Joi.boolean()
            .label("Disabled")
            .required()
            .default(false)
            .meta({ component: "checkbox" }),
        Joi.date().label("Start Date").required().meta({ type: "date" }),
        Joi.date().label("End Time").meta({ type: "time" }).required(),
        Joi.object().label("File Upload").meta({ component: "file" })
    ],
    submit() {
        this.refs.form.submit();
    },
    render() {
        return (
            <div>
                <JoiForm
                    ref="form"
                    schema={this.joyStuff}
                    values={this.state.values}
                    errors={this.state.errors}
                    controlled={true}
                    {...themes.material}
                    onChange={(e, formValues) => {
                        this.setState({ values: formValues });
                    }}
                    onSubmit={(e, formValues) => {}}
                />
                <button onClick={this.submit}>Test</button>
            </div>
        );
    }
});
// <Inspector data={ this.state || {} } />
//
// <br />
// <br />
module.exports = Basic;

render(<Basic />, document.getElementById("basic"));
