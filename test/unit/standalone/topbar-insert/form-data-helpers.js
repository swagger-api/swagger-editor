
import { fromJS } from 'immutable';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import AddForm from 'src/standalone/topbar-insert/forms/components/AddForm';
import FormChild from 'src/standalone/topbar-insert/forms/components/FormChild';
import FormDropdown from 'src/standalone/topbar-insert/forms/components/FormDropdown';
import FormInput from 'src/standalone/topbar-insert/forms/components/FormInput';
import FormInputWrapper from 'src/standalone/topbar-insert/forms/components/FormInputWrapper';
import FormMap from 'src/standalone/topbar-insert/forms/components/FormMap';
import InsertForm from 'src/standalone/topbar-insert/forms/components/InsertForm';
import InsertFormInput from 'src/standalone/topbar-insert/forms/components/InsertFormInput';
import InsertFormList from 'src/standalone/topbar-insert/forms/components/InsertFormList';

configure({ adapter: new Adapter() });

describe('editor topbar insert form UI generation', () => {
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

  it('should produce a valid form UI for a simple form object', () => { 
    const form = fromJS({
      fielda: {
        value: 'test value',
        isRequired: true,
        name: 'field a',
        updateForm: () => null
      }
    });

    const element = <InsertForm {...props} formData={form} />;
    const wrapper = mount(element);

    expect(wrapper.find('input').length).toEqual(1);
  });

  it('should produce a form ui with a dropdown', () => {
    const form = fromJS({
      fielda: {
        value: '',
        isRequired: true,
        name: 'field a',
        options: ['optiona', 'optionb'],
        updateForm: () => null
      }
    });

    const element = <InsertForm {...props} formData={form} />;
    const wrapper = mount(element);

    expect(wrapper.find('select').length).toEqual(1);
  });

  it('should produce a form ui with a list control', () => {
    const listControlItem = (updateForm, path) => fromJS({
      listItem: {
        value: 'list item value',
        name: 'List Item',
        updateForm: newForm => updateForm(newForm, path.concat(['listItem']))
      }
    });
    
    let path = [];

    const form = fromJS({
      fielda: {
        value: [listControlItem(() => null, path.concat(['fielda', 'value', 0]))],
        isRequired: true,
        name: 'field a',
        updateForm: () => null,
        defaultItem: i => listControlItem(() => null, path.concat(['fielda', 'value', i]) )
      }
    });

    const element = <InsertForm {...props} formData={form} />;
    const wrapper = mount(element);

    expect(wrapper.find('input').length).toEqual(1);
    expect(wrapper.find('a').length).toEqual(1);
  });

  it('should produce a form ui with a map', () => {
    const form = fromJS({
      fielda: {
        keyValue: '',
        value: {
          fieldb: {
            value: 'test value',
            isRequired: true,
            name: 'field b',
            updateForm: () => null
          }
        },
        isRequired: true,
        name: 'field a',
        updateForm: () => null
      }
    });

    const element = <InsertForm {...props} formData={form} />;
    const wrapper = mount(element);

    expect(wrapper.find('input').length).toEqual(2);
  });

  it(
    'should not render an input that depends on an input with no value',
    () => {
      const form = fromJS({
        fielda: {
          value: '',
          isRequired: true,
          name: 'field a',
          options: ['optiona', 'optionb'],
          updateForm: () => null
        },
        fieldb: {
          dependsOn: ['fielda', 'value'],
          updateOptions: () => { return ['option c', 'option d']; },
          value: '',
          isRequired: true,
          name: 'field a',
          options: [],
          updateForm: () => null
        },
      });

      const element = <InsertForm {...props} formData={form} />;
      const wrapper = mount(element);

      expect(wrapper.find('select').length).toEqual(1);
    }
  );

  it('should render an input that depends on an input with a value', () => {
    const form = fromJS({
      fielda: {
        value: 'optiona',
        isRequired: true,
        name: 'field a',
        options: ['optiona', 'optionb'],
        updateForm: () => null
      },
      fieldb: {
        dependsOn: ['fielda', 'value'],
        updateOptions: () => { return ['option c', 'option d']; },
        value: '',
        isRequired: true,
        name: 'field a',
        options: [],
        updateForm: () => null
      },
    });

    const element = <InsertForm {...props} formData={form} />;
    const wrapper = mount(element);

    expect(wrapper.find('select').length).toEqual(2);
  });
});