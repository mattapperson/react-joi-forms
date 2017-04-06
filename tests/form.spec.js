var Form = require("../src/index.js").JoiForm;
var fileDropTest = require("./setup/create-drop-test-image-event.js");
var Joi = require("joi-browser");
var React = require("react");

import { shallow } from "enzyme";

describe("JoiForm", () => {
    test("Should create an empty form object", () => {
        var FormComponent = shallow(<Form schema={[]} />);
        expect(FormComponent.find("form")).to.have.length(1);
    });

    test("Should create a form object with one input", () => {
        var joyStuff = [Joi.string().label("First Name")];
        var FormComponent = shallow(<Form schema={joyStuff} />);

        expect(wrapper.find("inputs")).to.have.length(1);
    });

    test("Should fire the onFocus events for input", done => {
        var joyStuff = [Joi.string().label("First Name")];
        var FormComponent = shallow(
            <Form
                schema={joyStuff}
                onFocus={e => {
                    expect(e).to.exist;
                    done();
                }}
            />
        );

        expect(wrapper.find("inputs")).to.have.length(1);

        checkbox.find("input").simulate("focus");
    });

    test("Should fire the onBlur events for input", done => {
        var joyStuff = [Joi.string().label("First Name")];
        var FormComponent = shallow(
            <Form
                schema={joyStuff}
                onBlur={e => {
                    expect(e).to.exist;
                    done();
                }}
            />
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        ReactTestUtils.Simulate.focus(inputs[0]);
        ReactTestUtils.Simulate.blur(inputs[0]);
    });

    test("Should not error for inputs that have no value when no rule requires a value", done => {
        var joyStuff = [
            Joi.string().label("First Name"),
            Joi.string().label("Last Name")
        ];
        var FormComponent = shallow(
            <Form
                schema={joyStuff}
                onSubmit={(err, values) => {
                    expect(err).to.not.exist;
                    done();
                }}
            />
        );
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(2);
        ReactTestUtils.Simulate.focus(inputs[0]);
        ReactTestUtils.Simulate.blur(inputs[0]);
        ReactTestUtils.Simulate.focus(inputs[1]);
        ReactTestUtils.Simulate.submit(form);
    });

    test("Can use a custom input for the UI", () => {
        var joyStuff = [Joi.string().label("First Name")];
        var customInputs = {
            textComponent: (error, value, options, events) => {
                // your custom element here...
                return (
                    <input
                        {...options}
                        type="text"
                        id="funky"
                        value={value}
                        onChange={events.onChange}
                        onFocus={events.onFocus}
                        onBlur={events.onBlur}
                    />
                );
            }
        };
        var FormComponent = shallow(
            <Form schema={joyStuff} {...customInputs} />
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs).to.exist;
        expect(inputs.length).to.equal(1);
        expect(inputs[0].id).to.equal("funky");
    });

    test("Should submit a form object with one input, and pass the forms data to onSubmit", done => {
        var joyStuff = [Joi.string().label("First Name")];
        var FormComponent = shallow(
            <Form
                schema={joyStuff}
                onSubmit={function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.exist;
                    expect(Object.keys(data).length).to.equal(1);

                    done();
                }}
            />
        );
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var input = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        )[0];

        input.value = "giraffe";
        ReactTestUtils.Simulate.change(input);

        ReactTestUtils.Simulate.submit(form);
    });

    test("Should return an error when form validation fails", done => {
        var joyStuff = [
            Joi.string().label("Error First Name").required().min(2),
            Joi.string().label("Error Last Name").required()
        ];
        var FormComponent;
        FormComponent = shallow(
            <Form
                schema={joyStuff}
                onSubmit={function(err, data) {
                    expect(err).to.exist;
                    expect(err.errorFirstName).to.equal(
                        '"Error First Name" is required'
                    );
                    expect(err.errorLastName).to.equal(
                        '"Error Last Name" is required'
                    );

                    expect(data).to.not.exist;

                    done();
                }}
            />
        );
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );

        ReactTestUtils.Simulate.submit(form);
    });

    test("Should populate forms with values param", () => {
        var joyStuff = [Joi.string().label("First Name").required()];
        var values = {
            firstName: "foo bar"
        };
        var FormComponent = shallow(<Form schema={joyStuff} values={values} />);
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs[0].type).to.equal("text");
        expect(inputs[0].value).to.equal("foo bar");
    });

    test("Should update the value when user enters text", done => {
        var joyStuff = [Joi.string().label("First Name").required()];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;

                if (value) {
                    expect(firstInput.value).to.equal("giraffe");
                    return done();
                }

                // your custom element here...
                return (
                    <input
                        {...options}
                        type="text"
                        value={value}
                        onChange={events.onChange}
                        onFocus={events.onFocus}
                        onBlur={events.onBlur}
                    />
                );
            }
        };
        FormComponent = shallow(<Form schema={joyStuff} {...customInputs} />);
        inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );
        firstInput = inputs[0];

        expect(inputs[0].type).to.equal("text");

        var testInput = inputs[0];
        testInput.value = "giraffe";
        ReactTestUtils.Simulate.change(testInput);
    });

    test("Should update the error prop when user enters invalid text then blurs the field", done => {
        var joyStuff = [
            Joi.string().label("component First Name").min(10).required(),
            Joi.string().label("component Last Name").min(2).required()
        ];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;
                if (error) {
                    expect(firstInput.value).to.equal("giraffe");
                    return done();
                }

                // your custom element here...
                return (
                    <input
                        {...options}
                        type="text"
                        value={value}
                        onChange={events.onChange}
                        onFocus={events.onFocus}
                        onBlur={events.onBlur}
                    />
                );
            }
        };
        FormComponent = shallow(<Form schema={joyStuff} {...customInputs} />);
        inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );
        firstInput = inputs[0];

        expect(inputs[0].type).to.equal("text");

        var testInput = inputs[0];
        testInput.value = "giraffe";
        ReactTestUtils.Simulate.change(testInput);
        ReactTestUtils.Simulate.blur(testInput);
    });

    test("Should clear error prop when user updates field that had errored", done => {
        var joyStuff = [
            Joi.string().label("component First Name").min(10).required(),
            Joi.string().label("component Last Name").min(2).required()
        ];
        var FormComponent, inputs, firstInput;
        var customInputs = {
            textComponent: (error, value, options, events) => {
                delete options.masks;

                switch (value) {
                    case "giraffes":
                        expect(error).to.exist;
                        break;
                    case "giraffe 8910":
                        expect(error).to.not.exist;
                        return done();
                        break;
                }

                // your custom element here...
                return (
                    <input
                        {...options}
                        type="text"
                        value={value}
                        onChange={events.onChange}
                        onFocus={events.onFocus}
                        onBlur={events.onBlur}
                    />
                );
            }
        };
        FormComponent = shallow(<Form schema={joyStuff} {...customInputs} />);
        inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );
        firstInput = inputs[0];

        expect(inputs[0].type).to.equal("text");

        var testInput = inputs[0];
        testInput.value = "giraffe";
        ReactTestUtils.Simulate.change(testInput);

        ReactTestUtils.Simulate.blur(testInput);

        testInput.value = "giraffes";
        ReactTestUtils.Simulate.change(testInput);

        testInput.value = "giraffe 8910";
        ReactTestUtils.Simulate.change(testInput);
    });

    if (!process || !process.env.ENV_JSDOM) {
        test("Should populate input with placeholder param", () => {
            var joyStuff = [
                Joi.string()
                    .label("First Name")
                    .required()
                    .example("this is a placeholder")
            ];
            var FormComponent = shallow(<Form schema={joyStuff} />);
            var form = ReactTestUtils.findRenderedDOMComponentWithTag(
                FormComponent,
                "form"
            );
            var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
                FormComponent,
                "input"
            );

            expect(inputs[0].placeholder).to.equal("this is a placeholder");
        });
    }

    test("Should create a password text input", () => {
        var joyStuff = [
            Joi.string()
                .label("First Name")
                .meta({ type: "password" })
                .required()
        ];
        var values = {
            firstName: "foo bar"
        };
        var FormComponent = shallow(<Form schema={joyStuff} values={values} />);
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs[0].type).to.equal("password");
        expect(inputs[0].value).to.equal("foo bar");
    });

    test("Should create an html5 email text input", () => {
        var joyStuff = [
            Joi.string()
                .email()
                .label("Email Address")
                .required()
                .meta({ type: "email" })
        ];
        var FormComponent = shallow(<Form schema={joyStuff} />);
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs[0].type).to.equal("email");
    });

    test("Should create a text area", () => {
        var joyStuff = [
            Joi.string()
                .label("First Name")
                .meta({ component: "textArea" })
                .required()
        ];
        var values = {
            firstName: "foo bar"
        };
        var FormComponent = shallow(<Form schema={joyStuff} values={values} />);
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            FormComponent,
            "form"
        );
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "textarea"
        );

        expect(inputs[0]).to.exist;
    });

    test("Should create a select box", () => {
        var joyStuff = [
            Joi.string()
                .label("Select Box")
                .valid(["c", "C"])
                .meta({ component: "select" })
        ];
        var FormComponent = shallow(<Form schema={joyStuff} />);
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "select"
        );
        var options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "option"
        );

        expect(inputs[0]).to.exist;
        expect(inputs[0].name).to.equal("selectBox");

        expect(options[0]).to.exist;
        expect(options.length).to.equal(2);
        expect(options[0].value).to.equal("c");
        expect(options[0].text).to.equal("c");
    });

    test("Should create a select box with custom names", () => {
        var joyStuff = [
            Joi.string()
                .label("Select Box With Custom Names")
                .valid(["c", "C"])
                .meta({ component: "select", names: ["cat", "Big Cat"] })
        ];
        var FormComponent = shallow(<Form schema={joyStuff} />);
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "select"
        );
        var options = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "option"
        );

        expect(inputs[0]).to.exist;
        expect(options[0]).to.exist;
        expect(options.length).to.equal(2);
        expect(options[0].value).to.equal("c");
        expect(options[0].text).to.equal("cat");
    });

    // For some reason, jsdom is leaking this test into the rest of the system...
    if (!process || !process.env.ENV_JSDOM) {
        test("Should create a check box", () => {
            var joyStuff = [
                Joi.boolean().label("Check Box").meta({ component: "checkbox" })
            ];
            var FormComponent = shallow(<Form schema={joyStuff} />);
            var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
                FormComponent,
                "input"
            );

            expect(inputs[0]).to.exist;
            expect(inputs[0].type).to.equal("checkbox");
        });
    }

    test("Should create a file input", () => {
        var joyStuff = [
            Joi.object().label("File Upload").meta({ component: "file" })
        ];
        var FormComponent = shallow(<Form schema={joyStuff} />);
        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            FormComponent,
            "input"
        );

        expect(inputs[0]).to.exist;
        expect(inputs[0].type).to.equal("file");
    });

    if (!process || !process.env.ENV_JSDOM) {
        test("Should capture file input on drop event", done => {
            fileDropTest(function(fakeEvt, randomFile) {
                var joyStuff = [
                    Joi.object()
                        .label("File Upload")
                        .meta({ component: "file" })
                ];
                var FormComponent = shallow(
                    <Form
                        schema={joyStuff}
                        onChange={(e, formValues) => {
                            expect(typeof formValues.fileUpload).to.equal(
                                "object"
                            );
                            done();
                        }}
                    />
                );
                var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
                    FormComponent,
                    "input"
                );

                expect(inputs[0]).to.exist;
                expect(inputs[0].type).to.equal("file");
                ReactTestUtils.Simulate.change(inputs[0], fakeEvt);
            });
        });
    }
});
