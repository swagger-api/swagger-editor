
import { fromJS, OrderedMap, List } from 'immutable';
import { 
  validateUrl, 
  validateAlphaNum, 
  checkForEmptyValue,
  checkForErrors 
} from 'src/standalone/topbar-insert/forms/helpers/validation-helpers';

describe('editor topbar insert form validation', () => {

  it('should produce no errors for a valid form', () => { 
    const form = fromJS({
      fielda: {
        value: 'test value',
        isRequired: true,
        name: 'field a'
      },
      fieldb: {
        value: [ 
          { value: 'value a', isRequired: false, isValid: () => true }, 
          { value: 'value b', isRequired: false, isValid: () => true } 
        ],
        isRequired: true
      },
      fieldc: {
        value: '',
        isRequired: false
      }
    });

    const errors = checkForErrors(form)[1];
    const updatedForm = checkForErrors(form)[0];

    expect(errors).toEqual(false);
    expect(updatedForm.getIn(['fielda', 'value'])).toEqual('test value');
    expect(updatedForm.getIn(['fieldb', 'hasErrors'])).toEqual(false);
  });

  it('should produce errors for a form with an empty required value', () => {
    const form = fromJS({
      fielda: {
        value: '',
        isRequired: true,
        name: 'field a'
      }
    });

    const errors = checkForErrors(form)[1];
    const updatedForm = checkForErrors(form)[0];

    expect(errors).toBeTruthy();
    expect(updatedForm.getIn(['fielda', 'value'])).toEqual('');
    expect(updatedForm.getIn(['fielda', 'hasErrors'])).toBeTruthy();
  });

  it(
    'should produce errors for a form with data that does not meet validation',
    () => {
      const form = fromJS({
        fielda: {
          value: '@#*&$*@)#$&@#*$',
          isRequired: false,
          name: 'field a',
          isValid: () => false
        }
      });
      
      const errors = checkForErrors(form)[1];
      const updatedForm = checkForErrors(form)[0];

      expect(errors).toBeTruthy();
      expect(updatedForm.getIn(['fielda', 'value'])).toEqual('@#*&$*@)#$&@#*$');
      expect(updatedForm.getIn(['fielda', 'hasErrors'])).toBeTruthy();
    }
  );

  it('should correctly validate valid urls', () => {
    expect(validateUrl('https://petstore.swagger.io')).toBeTruthy();
    expect(validateUrl('https://www.bing.com/search?q=open+api&qs=n&form=QBLH&sp=-1&pq=open+api&sc=6-8&sk=&cvid=2B4FC1A0686B42FAA4DE3534FDA56A8B')).toBeTruthy();
  });

  it('should correctly validate invalid urls', () => {
    expect(validateUrl('')).toBeFalsy();
    expect(validateUrl('test')).toBeFalsy();
  });

  it('should correctly validate alphanumeric strings', () => {
    expect(validateAlphaNum('abcde12345')).toBeTruthy();
    expect(validateAlphaNum('42')).toBeTruthy();
    expect(validateAlphaNum('AaBbCc')).toBeTruthy();
  });

  it('should correctly validate invalid alphanumeric strings', () => {
    expect(validateAlphaNum('')).toBeFalsy();
    expect(validateAlphaNum('abc@123')).toBeFalsy();
    expect(validateAlphaNum('*')).toBeFalsy();
  });

  it('should correctly detect an empty value', () => {
    expect(checkForEmptyValue(new OrderedMap())).toBeTruthy();
    expect(checkForEmptyValue(' ')).toBeTruthy();
    expect(checkForEmptyValue([])).toBeTruthy();
    expect(checkForEmptyValue(new List())).toBeTruthy();
    expect(checkForEmptyValue('')).toBeTruthy();
  });

  it('should correclty detect a non-empty value', () => {
    expect(checkForEmptyValue('value')).toBeFalsy();
    expect(checkForEmptyValue(fromJS({ test: ''}))).toBeFalsy();
    expect(checkForEmptyValue(fromJS(['']))).toBeFalsy();
  });
});