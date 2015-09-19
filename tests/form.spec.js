var React = require('react/addons');
var Form = require('../src/index.js').JoiForm;
var TestUtils = React.addons.TestUtils;
var fileDropTest = require('./setup//create-drop-test-image-event.js');

var Joi = require('joi');

describe('JoiForm', () => {

    it('Should create an empty form object', () => {
        var FormComponent = TestUtils.renderIntoDocument(<Form />);

        expect(FormComponent.getDOMNode().tagName).to.equal('FORM');
    });

    it('Should create a form object with one input', () => {
        var joyStuff = [
            Joi.string().label('First Name')
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        expect(inputs[0].getDOMNode().type).to.equal('text');
    });

    it('Should fire the onFocus events for input', (done) => {
        var joyStuff = [
            Joi.string().label('First Name')
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onFocus={(e) => {
            expect(e).to.exist;
            done()
        }}/>);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        React.addons.TestUtils.Simulate.focus(inputs[0]);
    });

    it('Should fire the onBlur events for input', (done) => {
        var joyStuff = [
            Joi.string().label('First Name')
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onBlur={(e) => {
            expect(e).to.exist;
            done()
        }}/>);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        React.addons.TestUtils.Simulate.focus(inputs[0]);
        React.addons.TestUtils.Simulate.blur(inputs[0]);
    });

    it('Should not error for inputs that have no value when no rule requires a value', (done) => {
        var joyStuff = [
            Joi.string().label('First Name'),
            Joi.string().label('Last Name'),
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onSubmit={(err, values) => {
            expect(err).to.not.exist;
            done()
        }}/>);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(2);
        React.addons.TestUtils.Simulate.focus(inputs[0]);
        React.addons.TestUtils.Simulate.blur(inputs[0]);
        React.addons.TestUtils.Simulate.focus(inputs[1]);
        TestUtils.Simulate.submit(form);

    });

    it('Can use a custom input for the UI', () => {
        var joyStuff = [
            Joi.string().label('First Name')
        ]
        var customInputs = {
            textComponent: (error, value, options, events) => {
                // your custom element here...
                return (
                    <input {...options}
                           type='text'
                           id='funky'
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                )
            },
        }
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} {...customInputs} />);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        expect(inputs[0].getDOMNode().id).to.equal('funky');
    });

    it('Should submit a form object with one input, and pass the forms data to onSubmit', (done) => {
        var joyStuff = [
            Joi.string().label('First Name')
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onSubmit={function(err, data) {
            expect(err).to.not.exist;
            expect(data).to.exist;
            expect(Object.keys(data).length).to.equal(1);

            done();
        }} />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var input = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input')[0].getDOMNode();

        input.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(input);

        TestUtils.Simulate.submit(form);
    });

    it('Should return an error when form validation fails', (done) => {
        var joyStuff = [
            Joi.string().label('Error First Name').required().min(2),
            Joi.string().label('Error Last Name').required()
        ]
        var FormComponent;
        FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onSubmit={function(err, data) {
            expect(err).to.exist;
            expect(err.errorFirstName).to.equal('"Error First Name" is required');
            expect(err.errorLastName).to.equal('"Error Last Name" is required');

            expect(data).to.not.exist;

            done();
        }} />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');

        TestUtils.Simulate.submit(form);
    });

    it('Should populate forms with values param', () => {
        var joyStuff = [
            Joi.string().label('First Name').required()
        ];
        var values = {
            firstName: 'foo bar'
        };
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff}
                                                               values={values}  />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs[0].getDOMNode().type).to.equal('text');
        expect(inputs[0].getDOMNode().value).to.equal('foo bar');

    });

    it('Should update the value when user enters text', (done) => {
        var joyStuff = [
            Joi.string().label('First Name').required()
        ];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;

                if(value) {
                    expect(firstInput.value).to.equal('giraffe');
                    return done();
                }

                // your custom element here...
                return (
                    <input {...options}
                           type='text'
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                )
            },
        }
        FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} {...customInputs} />);
        inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');
        firstInput = inputs[0].getDOMNode();

        expect(inputs[0].getDOMNode().type).to.equal('text');

        var testInput = inputs[0].getDOMNode();
        testInput.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(testInput);

    });

    it('Should update the error prop when user enters invalid text then blurs the field', (done) => {
        var joyStuff = [
            Joi.string().label('component First Name').min(10).required(),
            Joi.string().label('component Last Name').min(2).required()
        ];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;
                if(error) {
                    expect(firstInput.value).to.equal('giraffe');
                    return done();
                }

                // your custom element here...
                return (
                    <input {...options}
                           type='text'
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                )
            },
        }
        FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} {...customInputs} />);
        inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');
        firstInput = inputs[0].getDOMNode()

        expect(inputs[0].getDOMNode().type).to.equal('text');

        var testInput = inputs[0].getDOMNode();
        testInput.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(testInput);
        React.addons.TestUtils.Simulate.blur(testInput);


    });

    it('Should clear error prop when user updates field that had errored', (done) => {
        var joyStuff = [
            Joi.string().label('component First Name').min(10).required(),
            Joi.string().label('component Last Name').min(2).required()
        ];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;

                switch(value) {
                    case 'giraffes':
                        expect(error).to.exist;
                    break;
                    case 'giraffe 8910':
                        expect(error).to.not.exist;
                        return done();
                    break;
                }

                // your custom element here...
                return (
                    <input {...options}
                           type='text'
                           value={value}
                           onChange={events.onChange}
                           onFocus={events.onFocus}
                           onBlur={events.onBlur} />
                )
            },
        }
        FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} {...customInputs} />);
        inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');
        firstInput = inputs[0].getDOMNode()

        expect(inputs[0].getDOMNode().type).to.equal('text');

        var testInput = inputs[0].getDOMNode();
        testInput.value = 'giraffe';
        React.addons.TestUtils.Simulate.change(testInput);

        React.addons.TestUtils.Simulate.blur(testInput);


        testInput.value = 'giraffes';
        React.addons.TestUtils.Simulate.change(testInput);

        testInput.value = 'giraffe 8910'
        React.addons.TestUtils.Simulate.change(testInput);
    });

    if(!process || !process.env.ENV_JSDOM) {
        it('Should populate input with placeholder param', () => {
            var joyStuff = [
                Joi.string().label('First Name').required().example('this is a placeholder')
            ];
            var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
            var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
            var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

            expect(inputs[0].getDOMNode().placeholder).to.equal('this is a placeholder');

        });
    }

    it('Should create a password text input', () => {
        var joyStuff = [
            Joi.string().label('First Name').meta({type: 'password'}).required()
        ];
        var values = {
            firstName: 'foo bar'
        };
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff}
                                                               values={values}  />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs[0].getDOMNode().type).to.equal('password');
        expect(inputs[0].getDOMNode().value).to.equal('foo bar');

    });

    it('Should create an html5 email text input', () => {
        var joyStuff = [
            Joi.string().email().label('Email Address').required().meta({type: 'email'})
        ];
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs[0].getDOMNode().type).to.equal('email');

    });

    it('Should create a text area', () => {
        var joyStuff = [
            Joi.string().label('First Name').meta({component: 'textArea'}).required()
        ];
        var values = {
            firstName: 'foo bar'
        };
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff}
                                                               values={values}  />);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'textarea');

        expect(inputs[0]).to.exist;

    });

    it('Should create a select box', () => {
        var joyStuff = [
            Joi.string().label('Select Box').valid(['c', 'C']).meta({component:'select'})
        ];
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'select');
        var options = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'option');

        expect(inputs[0]).to.exist
        expect(inputs[0].getDOMNode().name).to.equal('selectBox');

        expect(options[0]).to.exist
        expect(options.length).to.equal(2);
        expect(options[0].getDOMNode().value).to.equal('c');
        expect(options[0].getDOMNode().text).to.equal('c');
    });

    it('Should create a select box with custom names', () => {
        var joyStuff = [
            Joi.string().label('Select Box With Custom Names').valid(['c', 'C']).meta({component:'select', names:['cat', 'Big Cat']})
        ];
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'select');
        var options = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'option');

        expect(inputs[0]).to.exist
        expect(options[0]).to.exist
        expect(options.length).to.equal(2);
        expect(options[0].getDOMNode().value).to.equal('c');
        expect(options[0].getDOMNode().text).to.equal('cat');
    });

    // For some reason, jsdom is leaking this test into the rest of the system...
    if(!process || !process.env.ENV_JSDOM) {

        it('Should create a check box', () => {
            var joyStuff = [
                Joi.boolean().label('Check Box').meta({component: 'checkbox'})
            ];
            var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
            var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

            expect(inputs[0]).to.exist
            expect(inputs[0].getDOMNode().type).to.equal('checkbox');
        });

    }

    it('Should create a file input', () => {
        var joyStuff = [
            Joi.object().label('File Upload').meta({component: 'file'})
        ];
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} />);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(inputs[0]).to.exist
        expect(inputs[0].getDOMNode().type).to.equal('file');
    });

    if(!process || !process.env.ENV_JSDOM) {

        it('Should capture file input on drop event', (done) => {
            fileDropTest(function(fakeEvt, randomFile) {
                var joyStuff = [
                    Joi.object().label('File Upload').meta({component: 'file'})
                ];
                var FormComponent = TestUtils.renderIntoDocument(
                    <Form schema={joyStuff}
                          onChange={(e, formValues) => {
                              expect(typeof formValues.fileUpload).to.equal('object');
                              done();
                          }}/>
                );
                var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

                expect(inputs[0]).to.exist;
                expect(inputs[0].getDOMNode().type).to.equal('file');
                TestUtils.Simulate.change(inputs[0].getDOMNode(), fakeEvt);
            });

        });

    }

});
