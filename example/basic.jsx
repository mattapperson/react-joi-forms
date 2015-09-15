var React = require('react');
var {JoiForm, FormSection} = require('../src/index');
var Joi = require('joi');
var materialInputs = require('./material-inputs');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var injectTapEventPlugin = require("react-tap-event-plugin");
var Inspector = require('react-json-inspector');

injectTapEventPlugin();
ThemeManager.setTheme(ThemeManager.types.LIGHT);

var Basic =  React.createClass({
    joyStuff: [
        Joi.string().label('First Name').required().min(2),
        Joi.string().label('Password').meta({mask:'password'}).required().min(2),
        Joi.string().label('Last Name').valid(['Apperson', 'Moseman']),
        Joi.string().label('Bio').meta({type:'textArea'}).required(),
        Joi.boolean().label('Enabled').meta({mask:'toggle'}).required(),
        Joi.boolean().label('Disabled').required().default(false),
        Joi.date().label('Start Date').required(),
        Joi.date().label('End Time').meta({mask:'time'}).required(),
    ],
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    submit() {
        this.refs.form.submit();
    },
    render() {

        return (
            <div>
                <Inspector data={ this.state || {} } />

                    <br />
                    <br />
                <JoiForm ref="form" schema={this.joyStuff}
                        {...materialInputs}
                        onChange={(e, formValues) => {
                            this.setState(formValues)
                        }}
                        onSubmit={(e, formValues) => {

                        }}/>
                    <button onClick={this.submit}>Test</button>
            </div>
        );
    }
});
module.exports = Basic;

React.render(<Basic />, document.getElementById('basic'));
