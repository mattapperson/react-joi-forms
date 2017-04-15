"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _enzyme = require("enzyme");

var Form = require("../src/index.js").JoiForm;
var Input = require("../src/index.js").JoiInput;
// var fileDropTest = require("./setup/create-drop-test-image-event.js");
var Joi = require("joi-browser");
var React = require("react");

describe("JoiInput", function () {
    test("Should create an empty container div", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Input, null), {
            joiFormGlobal: {
                components: { text: function text() {} }
            },
            joiForm: {
                schema: {},
                errors: {}
            }
        });

        expect(component.find("div")).toHaveLength(1);
    });

    test("Should merge meta with props and return field params", function () {
        var component = (0, _enzyme.shallow)(React.createElement(Input, { name: "name", type: "password" }), {
            context: {
                joiFormGlobal: {
                    components: {
                        password: function password() {
                            return React.createElement("span", null);
                        }
                    }
                },
                joiForm: {
                    schema: {
                        name: Joi.string().meta({ foo: "bar", name: "bar" })
                    },
                    errors: {},
                    onChange: function onChange() {},
                    onEvent: function onEvent() {}
                }
            }
        });
        var getFieldParams = component.instance().__getFieldParams;
        var fieldParams = getFieldParams(component.instance().props, component.context().joiForm.schema.name);

        expect(fieldParams.name).toEqual("name");
        expect(fieldParams.type).toEqual("password");
        expect(fieldParams.foo).toEqual("bar");
        expect(_typeof(fieldParams.schema)).toEqual("object");
        expect(fieldParams.errors).toEqual(undefined);
        expect(fieldParams.label).toEqual(undefined);
        expect(fieldParams.required).toEqual(false);
        expect(fieldParams.default).toEqual(undefined);
        expect(fieldParams.key).toEqual("name");
    });
});