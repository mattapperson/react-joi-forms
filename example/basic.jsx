var React = require('react');
var {JoiForm, FormSection, themes} = require('../src/index');
var Joi = require('joi');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var injectTapEventPlugin = require("react-tap-event-plugin");
var Inspector = require('react-json-inspector');

injectTapEventPlugin();
ThemeManager.setTheme(ThemeManager.types.LIGHT);

var Basic =  React.createClass({
    joyStuff: [
        Joi.string().label('First Name').required().min(2),
        Joi.string().label('Middle Name'),
        Joi.string().label('Password').meta({type:'password'}).required().min(2),
        Joi.string().label('Last Name').valid(['Apperson', 'Moseman']).meta({component: 'select'}),
        Joi.string().label('Complex Dropdown').valid(['Matt', 'Andy']).meta({component: 'select', names: ['Matt Apperson', 'Andy Moseman']}),
        Joi.string().label('Bio').meta({component:'textArea'}).required(),
        Joi.boolean().label('Enabled').meta({component: 'checkbox', type:'toggle'}).required(),
        Joi.boolean().label('Disabled').required().default(false).meta({component: 'checkbox'}),
        Joi.date().label('Start Date').required().meta({type:'date'}),
        Joi.date().label('End Time').meta({type:'time'}).required(),
        Joi.object().label('File Upload').meta({component: 'file'})
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
                        {...themes.material}
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
