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

    test("Should merge meta with props ", () => {
        var component = shallow(<Input baz="bar" />, {
            context: {
                joiForm: {
                    schema: {
                        name: Joi.string().meta({ foo: "bar" })
                    }
                }
            }
        });
        const getFieldParams = component.instance().__getFieldParams;

        expect(
            getFieldParams(
                component.instance().props,
                component.context().joiForm.schema.name
            )
        ).toEqual({
            baz: "bar",
            foo: "bar"
        });
    });
});
