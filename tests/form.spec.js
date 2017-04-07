var Form = require("../src/index.js").JoiForm;
var Input = require("../src/index.js").JoiInput;
// var fileDropTest = require("./setup/create-drop-test-image-event.js");
var Joi = require("joi-browser");
var React = require("react");

import { shallow } from "enzyme";

describe("JoiForm", () => {
    test("Should create an empty form object", () => {
        var component = shallow(<Form />);

        expect(component.find("form")).toHaveLength(1);
    });

    test("Should create an empty form object, with schema set", () => {
        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
            />
        );

        expect(component.state()).toHaveProperty("schema");
        expect(typeof component.state().schema).toEqual("object");
        expect(typeof component.state().schema).not.toBeInstanceOf(Array);
        expect(component.state().schema).toHaveProperty("name");
    });

    test("Should pass joiForm via context", () => {
        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
            />
        );
        var context = component.instance().getChildContext();

        expect(context).toHaveProperty("joiForm");
        expect(context.joiForm).toBeInstanceOf(Object);
    });

    test("Should pass schema down via context", () => {
        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
            />
        );
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("schema");
        expect(context.joiForm.schema).toBeInstanceOf(Object);
        expect(context.joiForm.schema).toHaveProperty("name");
        expect(context.joiForm.schema.name).toBeInstanceOf(Object);
    });

    test("Should pass values down via context", () => {
        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
                values={{
                    name: "matt"
                }}
            />
        );
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("values");
        expect(context.joiForm.values).toBeInstanceOf(Object);
        expect(context.joiForm.values.name).toEqual("matt");
    });

    test("Should fire the onBlur events via context", () => {
        const mockBlur = jest.fn();

        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
                values={{
                    name: "matt"
                }}
                onBlur={mockBlur}
            />
        );
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("onBlur");

        context.joiForm.onBlur({ target: { name: "name", value: "matt" } });

        expect(mockBlur.mock.calls).toEqual([
            [null, { target: { name: "name", value: "matt" } }]
        ]);
    });

    test("Should validate onBlur events, passing errors for input via context", () => {
        const mockBlur = jest.fn();

        var component = shallow(
            <Form
                schema={{
                    name: Joi.string().label("First Name")
                }}
                values={{
                    name: 22
                }}
                onBlur={mockBlur}
            />
        );
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("errors");

        context.joiForm.onBlur({ target: { name: "name", value: 22 } });

        expect(mockBlur.mock.calls).toEqual([
            [
                '"First Name" must be a string',
                { target: { name: "name", value: 22 } }
            ]
        ]);
    });

    test("Should fire onChange events for input via context", () => {});

    test("Should clear any error when onChange events for input via context", () => {});

    test("Should fire the onFocus events for input via context", () => {});

    test("Should re-validate entire form onSubmit", () => {});

    test("Should onSubmit should fail if validation does", () => {});

    test("Should fire the onSubmit events via submit button", () => {});
});
