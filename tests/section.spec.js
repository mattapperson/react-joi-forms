var renderer = require("react-test-renderer");
var Form = require("../src/index.js").JoiForm;
var FormSection = require("../src/index.js").FormSection;
var React = require("react");

var Joi = require("joi-browser");

describe("FormSection", () => {
    test("Should use camel cased label for name when no name provided", done => {
        var joyStuff = [Joi.string().label("First Name")];
        var FormComponent = renderer.create(
            <Form
                schema={joyStuff}
                onSubmit={(err, values) => {
                    expect(values).to.exist;
                    expect(values.firstName).to.exist;

                    done();
                }}
            />
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should use name when provided", done => {
        var joyStuff = [
            Joi.string().label("First Name").meta({ name: "funky" })
        ];
        var FormComponent = renderer.create(
            <Form
                schema={joyStuff}
                onSubmit={(err, values) => {
                    expect(values).to.exist;
                    expect(values.funky).to.exist;
                    expect(values.firstName).to.not.exist;

                    done();
                }}
            />
        );

        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test("Should create a form containing one section", () => {
        var joiSchema = [
            Joi.string().label("field one"),
            Joi.string().label("field two")
        ];
        var FormComponent = renderer.create(
            <Form>
                <FormSection schema={joiSchema} />
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should create a form containing two sections but no tags", () => {
        var joiSchema = [
            Joi.string().label("field one"),
            Joi.string().label("field two")
        ];
        var FormComponent = renderer.create(
            <Form schema={joiSchema}>
                <div>
                    <FormSection />
                </div>
                <div>
                    <FormSection />
                </div>
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should create a form containing two sections w/tags", () => {
        var joiSchema = [
            Joi.string().label("field one").tags("section1"),
            Joi.string().label("field two").tags("section2")
        ];
        var FormComponent = renderer.create(
            <Form schema={joiSchema}>
                <div>
                    <FormSection tag="section1" />
                </div>
                <div>
                    <FormSection tag="section2" />
                </div>
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should create a form with a section containing 0 fields", () => {
        var joiSchema = [
            Joi.string().label("field one").tags("section1"),
            Joi.string().label("field one").tags("section2")
        ];
        var FormComponent = renderer.create(
            <Form schema={joiSchema}>
                <FormSection tag="foo" />
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should create a form containing two sections but both values should be returned", done => {
        var joiSchema = [
            Joi.string().label("field one").tags("section1"),
            Joi.string().label("field two").tags("section2")
        ];
        var FormComponent = renderer.create(
            <Form
                schema={joiSchema}
                onSubmit={function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.exist;
                    expect(data.fieldOne).to.equal("giraffe");
                    expect(data.fieldTwo).to.equal("snake");

                    done();
                }}>
                <div>
                    <FormSection tag="section1" />
                </div>
                <div>
                    <FormSection tag="section2" />
                </div>
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("Should create a form containing two sections but both values should be returned even with a component layout", done => {
        var Grid = React.createClass({
            render() {
                return (
                    <div>
                        {this.props.children}
                    </div>
                );
            }
        });

        var joiSchema = [
            Joi.string().label("field one").tags("section1"),
            Joi.string().label("field two").tags("section2")
        ];
        var FormComponent = renderer.create(
            <Form
                schema={joiSchema}
                onSubmit={function(err, data) {
                    expect(err).to.not.exist;
                    expect(data).to.exist;
                    expect(data.fieldOne).to.equal("giraffe");
                    expect(data.fieldTwo).to.equal("snake");

                    done();
                }}>
                <Grid>
                    <FormSection tag="section1" />
                </Grid>
                <Grid>
                    <FormSection tag="section2" />
                </Grid>
            </Form>
        );
        let tree = FormComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
