"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _enzyme = require("enzyme");

var Form = require("../src/index.js").JoiForm;
var Input = require("../src/index.js").JoiInput;
// var fileDropTest = require("./setup/create-drop-test-image-event.js");
var Joi = require("joi-browser");
var React = require("react");

describe("JoiForm", function () {
    test("Should create an empty form object", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Form, null));

        expect(component.find("form")).toHaveLength(1);
    });

    test("Should create an empty form object, with schema set", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            }
        }));

        expect(component.state()).toHaveProperty("schema");
        expect(_typeof(component.state().schema)).toEqual("object");
        expect(_typeof(component.state().schema)).not.toBeInstanceOf(Array);
        expect(component.state().schema).toHaveProperty("name");
    });

    test("Should pass joiForm via context", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            }
        }));
        var context = component.instance().getChildContext();

        expect(context).toHaveProperty("joiForm");
        expect(context.joiForm).toBeInstanceOf(Object);
    });

    test("Should pass schema down via context", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            }
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("schema");
        expect(context.joiForm.schema).toBeInstanceOf(Object);
        expect(context.joiForm.schema).toHaveProperty("name");
        expect(context.joiForm.schema.name).toBeInstanceOf(Object);
    });

    test("Should pass values down via context", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            },
            values: {
                name: "matt"
            }
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("values");
        expect(context.joiForm.values).toBeInstanceOf(Object);
        expect(context.joiForm.values.name).toEqual("matt");
    });

    test("Should fire the onBlur events via context", function () {
        var mockBlur = jest.fn();

        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            },
            values: {
                name: "matt"
            },
            onBlur: mockBlur
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("onBlur");

        context.joiForm.onBlur({ target: { name: "name", value: "matt" } });

        expect(mockBlur.mock.calls).toEqual([[null, { target: { name: "name", value: "matt" } }]]);
    });

    test("Should validate onBlur events, passing errors for input via context", function () {
        var mockBlur = jest.fn();

        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            },
            values: {
                name: 22
            },
            onBlur: mockBlur
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("errors");

        context.joiForm.onBlur({ target: { name: "name", value: 22 } });

        expect(mockBlur.mock.calls).toEqual([['"First Name" must be a string', { target: { name: "name", value: 22 } }]]);
    });

    test("Should fire onChange events for input via context", function () {
        var mockChange = jest.fn();
        var preventDefault = jest.fn();

        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            },
            onChange: mockChange
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("onChange");

        context.joiForm.onChange({
            target: { name: "name", value: "foo" },
            preventDefault: preventDefault
        }, { name: "foo" });

        expect(mockChange.mock.calls).toEqual([[{
            target: { name: "name", value: "foo" },
            preventDefault: preventDefault
        }, { name: "foo" }]]);
    });

    test("Should clear any error when onChange events for input via context", function () {
        var context;
        var preventDefault = jest.fn();

        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            }
        }));
        component.setState({
            errors: {
                name: "some error"
            }
        });

        context = component.instance().getChildContext();

        expect(context.joiForm.errors).toHaveProperty("name");

        context.joiForm.onChange({
            target: { name: "name", value: "foo" },
            preventDefault: preventDefault
        }, { name: "foo" });

        context = component.instance().getChildContext();

        expect(context.joiForm.errors).not.toHaveProperty("name");
    });

    test("Should fire the onFocus events for input via context", function () {
        var mockFocus = jest.fn();
        var preventDefault = jest.fn();

        var component = (0, _enzyme.shallow)(React.createElement(Form, {
            schema: {
                name: Joi.string().label("First Name")
            },
            onFocus: mockFocus
        }));
        var context = component.instance().getChildContext();

        expect(context.joiForm).toHaveProperty("onFocus");

        context.joiForm.onFocus({
            target: { name: "name", value: "foo" },
            preventDefault: preventDefault
        });

        expect(mockFocus.mock.calls).toEqual([[{
            target: { name: "name", value: "foo" },
            preventDefault: preventDefault
        }]]);
    });

    test("Should fire the onSubmit events via submit button", function () {
        var mockSubmit = jest.fn();
        var preventDefault = jest.fn();

        var component = (0, _enzyme.mount)(React.createElement(
            Form,
            {
                schema: {
                    name: Joi.string().label("First Name")
                },
                values: {
                    name: 22
                },
                onSubmit: mockSubmit },
            React.createElement(
                "button",
                { type: "submit", value: "Submit" },
                "Submit"
            )
        ));
        var context = component.instance().getChildContext();

        component.find('[type="submit"]').get(0).click();

        // error should exist
        expect(mockSubmit.mock.calls[0][0]).not.toBeNull();
        expect(mockSubmit.mock.calls[0][0]).toEqual({
            name: '"First Name" must be a string'
        });

        // value should be passed for all fields
        expect(mockSubmit.mock.calls[0][1]).toEqual({ name: 22 });

        // raw event passed
        expect(_typeof(mockSubmit.mock.calls[0][2])).toEqual("object");
    });

    test("Should onSubmit should fail if validation does", function () {
        var mockSubmit = jest.fn();
        var preventDefault = jest.fn();

        var component = (0, _enzyme.mount)(React.createElement(
            Form,
            {
                schema: {
                    name: Joi.string().label("First Name")
                },
                values: {
                    name: "foo"
                },
                onSubmit: mockSubmit },
            React.createElement(
                "button",
                { type: "submit", value: "Submit" },
                "Submit"
            )
        ));
        var context = component.instance().getChildContext();

        component.find('[type="submit"]').get(0).click();

        // error should not exist
        expect(mockSubmit.mock.calls[0][0]).toBeNull();

        // value should be passed for all fields
        expect(mockSubmit.mock.calls[0][1]).toEqual({ name: "foo" });

        // raw event passed
        expect(_typeof(mockSubmit.mock.calls[0][2])).toEqual("object");
    });
});