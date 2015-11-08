var React = require('react/addons');
var Form = require('../src/index.js').JoiForm;
var FormSection = require('../src/index.js').FormSection;
var TestUtils = React.addons.TestUtils;

var Joi = require('joi');

describe('FormSection', () => {

    it('Should use camel cased label for name when no name provided', (done) => {
        var joyStuff = [
            Joi.string().label('First Name'),
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onSubmit={(err, values) => {
            expect(values).to.exist;
            expect(values.firstName).to.exist;

            done()
        }}/>);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var input = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input')[0];

        input.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(input);
        TestUtils.Simulate.submit(form);

    });

    it('Should use name when provided', (done) => {
        var joyStuff = [
            Joi.string().label('First Name').meta({name: 'funky'}),
        ]
        var FormComponent = TestUtils.renderIntoDocument(<Form schema={joyStuff} onSubmit={(err, values) => {
            expect(values).to.exist;
            expect(values.funky).to.exist;
            expect(values.firstName).to.not.exist;

            done()
        }}/>);
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var input = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input')[0];

        input.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(input);
        TestUtils.Simulate.submit(form);

    });
    it('Should create a form containing one section', () => {
        var joiSchema = [
            Joi.string().label('field one'),
            Joi.string().label('field two'),
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form>
                <FormSection schema={joiSchema} />
            </Form>
        );
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);

        expect(sections.length).to.equal(1);
    });

    it('Should create a form containing two sections but no tags', () => {
        var joiSchema = [
            Joi.string().label('field one'),
            Joi.string().label('field two'),
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form schema={joiSchema}>
                <div>
                    <FormSection />
                </div>
                <div>
                    <FormSection />
                </div>
            </Form>
        );
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        var sectionOneInputs = TestUtils.scryRenderedDOMComponentsWithTag(sections[0], 'input');
        var sectionTwoInputs = TestUtils.scryRenderedDOMComponentsWithTag(sections[1], 'input');

        expect(sections.length).to.equal(2);
        expect(inputs.length).to.equal(4);

        expect(sectionOneInputs.length).to.equal(2);
        expect(sectionTwoInputs.length).to.equal(2);
    });

    it('Should create a form containing two sections w/tags', () => {
        var joiSchema = [
            Joi.string().label('field one').tags('section1'),
            Joi.string().label('field two').tags('section2'),
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form schema={joiSchema}>
                <div>
                    <FormSection tag="section1" />
                </div>
                <div>
                    <FormSection tag="section2" />
                </div>
            </Form>
        );
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        var sectionOneInputs = TestUtils.scryRenderedDOMComponentsWithTag(sections[0], 'input');
        var sectionTwoInputs = TestUtils.scryRenderedDOMComponentsWithTag(sections[1], 'input');

        expect(sections.length).to.equal(2);
        expect(inputs.length).to.equal(2);

        expect(sectionOneInputs.length).to.equal(1);
        expect(sectionTwoInputs.length).to.equal(1);

    });

    it('Should create a form with a section contain 0 fields', () => {
        var joiSchema = [
            Joi.string().label('field one').tags('section1'),
            Joi.string().label('field one').tags('section2')
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form schema={joiSchema}>
                <FormSection tag="foo" />
            </Form>
        );
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');

        expect(sections.length).to.equal(1);
        expect(inputs.length).to.equal(0);

    });

    it('Should create a form containing two sections but both values should be returned', (done) => {
        var joiSchema = [
            Joi.string().label('field one').tags('section1'),
            Joi.string().label('field two').tags('section2'),
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form schema={joiSchema} onSubmit={function(err, data) {
                expect(err).to.not.exist;
                expect(data).to.exist;
                expect(data.fieldOne).to.equal('giraffe');
                expect(data.fieldTwo).to.equal('snake');

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
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);
        var sectionOneInput = TestUtils.scryRenderedDOMComponentsWithTag(sections[0], 'input')[0];
        var sectionTwoInput = TestUtils.scryRenderedDOMComponentsWithTag(sections[1], 'input')[0];

        expect(sections.length).to.equal(2);

        sectionOneInput.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(sectionOneInput);

        sectionTwoInput.value = 'snake'
        React.addons.TestUtils.Simulate.change(sectionTwoInput);
        TestUtils.Simulate.submit(form);

    });

    it('Should create a form containing two sections but both values should be returned even with a component layout', (done) => {
        var Grid = React.createClass({
            render() {
                return (
                    <div>
                        {this.props.children}
                    </div>
                )
            }
        });

        var joiSchema = [
            Joi.string().label('field one').tags('section1'),
            Joi.string().label('field two').tags('section2'),
        ];
        var FormComponent = TestUtils.renderIntoDocument(
            <Form schema={joiSchema} onSubmit={function(err, data) {
                expect(err).to.not.exist;
                expect(data).to.exist;
                expect(data.fieldOne).to.equal('giraffe');
                expect(data.fieldTwo).to.equal('snake');

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
        var form = TestUtils.findRenderedDOMComponentWithTag(FormComponent, 'form');
        var sections = TestUtils.scryRenderedComponentsWithType(FormComponent, FormSection);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(FormComponent, 'input');
        var sectionOneInput = TestUtils.scryRenderedDOMComponentsWithTag(sections[0], 'input')[0];
        var sectionTwoInput = TestUtils.scryRenderedDOMComponentsWithTag(sections[1], 'input')[0];

        expect(sections.length).to.equal(2);
        expect(inputs.length).to.equal(2);

        sectionOneInput.value = 'giraffe'
        React.addons.TestUtils.Simulate.change(sectionOneInput);

        sectionTwoInput.value = 'snake'
        React.addons.TestUtils.Simulate.change(sectionTwoInput);
        TestUtils.Simulate.submit(form);

    });

});
