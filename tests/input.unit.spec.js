var Form = require("../src/index.js").JoiForm;
var Input = require("../src/index.js").JoiInput;
// var fileDropTest = require("./setup/create-drop-test-image-event.js");
var Joi = require("joi-browser");
var React = require("react");

import { shallow, mount } from "enzyme";

describe("JoiInput", () => {
    test("Should create an empty container div", () => {
        var component = shallow(<Input />);

        expect(component.find("div")).toHaveLength(1);
    });

    test("Should merge meta with props and return field params", () => {
        var component = shallow(<Input name="name" type="password" />, {
            context: {
                joiForm: {
                    schema: {
                        name: Joi.string().meta({ foo: "bar", name: "bar" })
                    }
                }
            }
        });
        const getFieldParams = component.instance().__getFieldParams;
        const fieldParams = getFieldParams(
            component.instance().props,
            component.context().joiForm.schema.name
        );

        expect(fieldParams.name).toEqual("name");
        expect(fieldParams.type).toEqual("password");
        expect(fieldParams.foo).toEqual("bar");
        expect(typeof fieldParams.schema).toEqual("object");
        expect(fieldParams.errors).toEqual(undefined);
        expect(fieldParams.label).toEqual(undefined);
        expect(fieldParams.required).toEqual(false);
        expect(fieldParams.default).toEqual(undefined);
        expect(fieldParams.key).toEqual("name");
    });
});
