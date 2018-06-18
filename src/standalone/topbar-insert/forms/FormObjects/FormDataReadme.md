## Form Data Readme

A "Form Data" object is an object made up of immutable.js OrderedMap and List objects. It is used to describe a form that will be automatically generated from the object and to validate the inputs to that form.

The intent of a "Form Data" object is to allow easily-reusable forms that correspond to objects defined in the Open Api 3.0 specification. The helper methods for Form Objects are found in the helpers folder.

### Files with somenameObject.js naming scheme
These files describe a corresponding object in the Open Api specification using the object format. The somenameForm method in these files returns a form object describing an open api object. The somenameObject method takes in a somenameForm object and produces a javascript object that is a valid sub-piece of an open api document.

## Object format
```
  [fieldIdentifier]: new OrderedMap ({
    isRequired: required boolean,
    updateForm: required function,
    hasErrors: required boolean,
    value: required form data object || List of forms || string,
    isValid: optional function
    validationMessage: optional string
    description: optional string,
    name: optional string,
    options: optional array of strings,
    keyValue: optional string
})
```
#### isRequired
Whether or not the generated form field is required. Will automatically include validation for when the field is empty.

#### updateForm
A function that updates the form.
```
  (updatedObject, pathToObject) => { 
    // UPDATE the form data object in the parent state
  }
```
#### hasErrors
Used for validation purposes. Whether or not the form object or any children form objects have validation errors. Updated by ```checkForErrors(formData)```.

### value
The value of the form field or a child form object. Form fields will be recursively generated for child form objects. If this value is a list, then a "list control" form will be generated.

#### isValid
Optional function for validation of the value entered in the form field. Should return false if errors were found and true if the field is valid.
``` 
(value) => {
    // Return boolean indicating whether the value is valid.
  }
```
#### validationMessage
Optional validation message that will be shown when the field contains an invalid input.

#### description
Optional description of the form field.

#### name
The name that will be displayed above the form field.

#### options
If options is provided, the generated form field will be a dropdown.

#### keyValue
If keyValue is provided, then a form will be generated with a keyValue text input on the left and the "value" form input or child form on the right. This form is a "map" (key, value) pair, with keyValue as the user-entered key and value as the user-entered value.