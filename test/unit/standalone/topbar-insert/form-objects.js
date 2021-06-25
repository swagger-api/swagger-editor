
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { fromJS, List } from 'immutable';

import AddForm from 'src/standalone/topbar-insert/forms/components/AddForm';
import FormChild from 'src/standalone/topbar-insert/forms/components/FormChild';
import FormDropdown from 'src/standalone/topbar-insert/forms/components/FormDropdown';
import FormInput from 'src/standalone/topbar-insert/forms/components/FormInput';
import FormInputWrapper from 'src/standalone/topbar-insert/forms/components/FormInputWrapper';
import FormMap from 'src/standalone/topbar-insert/forms/components/FormMap';
import InsertForm from 'src/standalone/topbar-insert/forms/components/InsertForm';
import InsertFormInput from 'src/standalone/topbar-insert/forms/components/InsertFormInput';
import InsertFormList from 'src/standalone/topbar-insert/forms/components/InsertFormList';

import { pathForm, pathObject } from 'src/standalone/topbar-insert/forms/form-objects/path-object';
import { operationForm, operationObject } from 'src/standalone/topbar-insert/forms/form-objects/operation-object';
import { infoForm, infoObject } from 'src/standalone/topbar-insert/forms/form-objects/info-object';
import { licenseForm} from 'src/standalone/topbar-insert/forms/form-objects/license-object';
import { contactForm } from 'src/standalone/topbar-insert/forms/form-objects/contact-object';
import { tagsForm, tagsObject } from 'src/standalone/topbar-insert/forms/form-objects/tags-object';
import { tagForm } from 'src/standalone/topbar-insert/forms/form-objects/tag-object';
import { serversForm, serversObject } from 'src/standalone/topbar-insert/forms/form-objects/servers-object';
import { serverVariableForm } from 'src/standalone/topbar-insert/forms/form-objects/server-variable-object';
import { externalDocumentationForm } from 'src/standalone/topbar-insert/forms/form-objects/external-documentation-object';
import { addOperationTagsForm, addOperationTagsObject } from 'src/standalone/topbar-insert/forms/form-objects/add-operation-tags';
import { selectOperationForm } from 'src/standalone/topbar-insert/forms/form-objects/select-operation';
import { selectResponseForm } from 'src/standalone/topbar-insert/forms/form-objects/select-response';
import { exampleObject, exampleForm } from 'src/standalone/topbar-insert/forms/form-objects/example-value-object';

configure({ adapter: new Adapter() });

describe('editor topbar insert forms', () => {
  let components, props;

  beforeEach(() => {
    components = {
      FormDropdown,
      AddForm,
      FormChild,
      FormInput,
      FormInputWrapper,
      FormMap,
      InsertForm,
      InsertFormInput,
      InsertFormList
    };

    props = {
      getComponent: (c) => components[c]
    };
  });


  describe('operation object', () => {
    let form = operationForm(null, []);

    const tag = form.getIn(['tags', 'defaultItem'])(null, []);

    form = form
      .setIn(['path', 'value'], '/testpath')
      .setIn(['summary', 'value'], 'test summary')
      .setIn(['description', 'value'], 'test description')
      .setIn(['operationid', 'value'], 'testid')
      .setIn(['tags', 'value'], new List([tag.setIn(['tag', 'value'], 'test tag' )]));

    const object = operationObject(form);

    it(
      'should correctly process the operation form into the operation object',
      () => {
        const expected = {
          summary: 'test summary',
          description: 'test description',
          operationId: 'testid',
          tags: ['test tag'],
          responses: {
            default: {
              description: 'Default error sample response'
            }
          }
        };

        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(4);
      expect(wrapper.find('select').length).toEqual(2);
    });
  });

  describe('info object', () => {
    const license = licenseForm(null, [], null)
    .setIn(['value', 'name', 'value'], 'test name')
    .setIn(['value', 'url', 'value'], 'test url');

    const contact = contactForm(null, [])
      .setIn(['value', 'name', 'value'], 'test name')
      .setIn(['value', 'url', 'value'], 'test url')
      .setIn(['value', 'email', 'value'], 'testemail@test.com');

    let form = infoForm(null, [])
      .setIn(['title', 'value'], 'test title')
      .setIn(['version', 'value'], 'test version')
      .setIn(['description', 'value'], 'test description')
      .setIn(['termsofservice', 'value'], 'testtermsofservice')
      .setIn(['license'], license)
      .setIn(['contact'], contact);

    it(
      'should correctly process the info form into the info object',
      () => {
        const object = infoObject(form);

        const expected = {
          title: 'test title',
          version: 'test version',
          description: 'test description',
          termsOfService: 'testtermsofservice',
          license: {
            name: 'test name',
            url: 'test url'
          },
          contact: {
            name: 'test name',
            url: 'test url',
            email: 'testemail@test.com'
          }
        };

        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(4);
    });
  });

  describe('path object', () => {
    let form = pathForm(null, []);

    // Set some values as though the user had entered data
    form = form
      .setIn(['path', 'value'], '/test')
      .setIn(['summary', 'value'], 'test summary')
      .setIn(['description', 'value'], 'test description');

    it('should correctly process the path form into the path object', () => {
      const object = pathObject(form);
      const expected = {
        key: '/test',
        value: {
          summary: 'test summary',
          description: 'test description'
        }
      };
      expect(object).toEqual(expected);
    });

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(3);
    });
  });

  describe('tag declarations object', () => {
    let form = tagsForm(null, []);

    const externalDocs = externalDocumentationForm(null, [])
      .setIn(['url', 'value'], 'test url')
      .setIn(['description', 'value'], 'test description');

    const tag = tagForm(null, [])
      .setIn(['name', 'value'], 'test tag name')
      .setIn(['description', 'value'], 'test description')
      .setIn(['externalDocs', 'value'], externalDocs);

    // Set some values as though the user had entered data
    form = form.setIn(['tags', 'value'], new List([tag]));

    it(
      'should correctly process the tag declarations form into the tags object',
      () => {
        const object = tagsObject(form);
        const expected = [
          {
            name: 'test tag name',
            description: 'test description',
            externalDocs: {
              url: 'test url',
              description: 'test description'
            }
          }
        ];
        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(2);
    });
  });

  describe('servers object', () => {
    let form = serversForm(null, []);
    const serverVariable = serverVariableForm(null, [])
      .setIn(['value', 0, 'value', 'default', 'value'], 'test default')
      .setIn(['value', 0, 'value', 'enum', 'value'], fromJS([{ value: 'test enum value'}]) )
      .setIn(['value', 0, 'value', 'vardescription', 'value'], 'test var description')
      .setIn(['value', 0, 'keyValue'], 'keyvalue');

    form = form
      .setIn(['servers', 'value', 0, 'url', 'value'], 'test url')
      .setIn(['servers', 'value', 0, 'description', 'value'], 'test description')
      .setIn(['servers', 'value', 0, 'variables'], serverVariable);

    it(
      'should correctly process the servers form into the servers object',
      () => {
        const object = serversObject(form);
        const expected = [
          {
            url: 'test url',
            description: 'test description',
            variables: {
              keyvalue: {
                default: 'test default',
                description: 'test var description',
                enum: [
                  'test enum value'
                ]
              }
            }
          }
        ];

        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(6);
    });
  });

  describe('add tags object', () => {
    const selectOperation = selectOperationForm(null, [])
        .setIn(['path', 'value'], '/test')
        .setIn(['operation', 'value'], 'GET');

    let form = addOperationTagsForm(null, [])
        .setIn(['selectoperation', 'value'], selectOperation)
        .setIn(['tags', 'value', 0, 'tag', 'value'], 'test tag');

    it(
      'should correctly process the add tags to operation into the add tags object',
      () => {
        const object = addOperationTagsObject(form);

        const expected = {
          selectedOperation: ['paths', '/test', 'GET'],
          tags: [
            'test tag'
          ]
        };

        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(1);
      expect(wrapper.find('select').length).toEqual(2);
    });
  });

  describe('add example response object', () => {
    const selectResponse = selectResponseForm(null, [])
      .setIn(['path', 'value'], '/test')
      .setIn(['operation', 'value'], 'GET')
      .setIn(['response', 'value'], '200')
      .setIn(['mediatype', 'value'], 'application/json');

    let form = exampleForm(null, [])
        .setIn(['selectresponse', 'value'], selectResponse)
        .setIn(['exampleName', 'value'], 'sample example name')
        .setIn(['exampleValue', 'value'], 'sample example value');

    it(
      'should correctly process the add example form into the form values object',
      () => {
        const object = exampleObject(form);

        const expected = {
          responsePath: ['paths', '/test', 'GET', 'responses', '200', 'content', 'application/json', 'examples'],
          exampleValue: 'sample example value',
          exampleName: 'sample example name'
        };

        expect(object).toEqual(expected);
      }
    );

    it('should correctly render the form UI for the form object', () => {
      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('input').length).toEqual(1);
      expect(wrapper.find('select').length).toEqual(4);
    });
  });
});
