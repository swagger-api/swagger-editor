import schemaTypeLint from './type';
import schema$IdLint from './id';
import schema$RefLint from './ref';
import schemaEnumLint from './enum';
import schemaMultipleOfLint from './multipleof';
import schemaMaximumLint from './maximum';
import schemaMinimumOfLint from './minimum';
import schemaExclusiveMaximumLint from './exclusivemaximum';
import schemaExclusiveMinimumLint from './exclusiveminimum';
import schemaMaxLengthLint from './maxlength';
import schemaMinLengthLint from './minlength';
import schemaMinLengthNonStringLint from './minlength-non-string';
import schemaMaxLengthNonStringLint from './maxlength-non-string';
import schemaPatternLint from './pattern';
import schemaItemsLint from './items';
import schemaItemsNonArrayLint from './items-non-array';
import schemaAdditionalItemsLint from './additionalitems';
import schemaAdditionalItemsNonArrayLint from './additionalitems-non-array';
import schemaMaxItemsLint from './maxitems';
import schemaMaxItemsNonArrayLint from './maxitems-non-array';
import schemaMinItemsLint from './minitems';
import schemaMinItemsNonArrayLint from './minitems-non-array';
import schemaUniqueItemsLint from './uniqueitems';
import schemaUniqueItemsNonArrayLint from './uniqueitems-non-array';
import schemaContainsLint from './contains';
import schemaContainsNonArrayLint from './contains-non-array';
import schemaMaxPropertiesLint from './maxproperties';
import schemaMaxPropertiesNonObjectLint from './maxproperties-non-object';
import schemaMinPropertiesLint from './minproperties';
import schemaMinPropertiesNonObjectLint from './minproperties-non-object';
import schemaRequiredLint from './required';
import schemaRequiredNonObjectLint from './required-non-object';
import schemaPropertiesLint from './properties';
import schemaPropertiesNonObjectLint from './properties-non-object';
import schemaPatternPropertiesLint from './patternproperties';
import schemaPatternPropertiesKeyLint from './patternproperties-key';
import schemaPatternPropertiesNonObjectLint from './patternproperties-non-object';
import schemaAdditionalPropertiesLint from './additionalproperties';
import schemaAdditionalPropertiesNonObjectLint from './additionalproperties-non-object';
import schemaPropertyNamesLint from './property-names';
import schemaPropertyNamesNonObjectLint from './propertynames-non-object';
import schemaPatternPropertiesObjectLint from './patternproperties-object';
import schemaPropertiesObjectLint from './properties-object';
import schemaRefNonSiblingsLint from './ref-non-siblings';
import schemaFormatLint from './format';
import schemaTitleLint from './title';
import schemaDescriptionLint from './description';
import schemaIfLint from './if';
import schemaIfNonThenLint from './if-non-then';
import schemaReadOnlyLint from './readonly';
import schemaWriteOnlyLint from './writeonly';
import schemaExamplesLint from './examples';
import schemaThenLint from './then';
import schemaElseLint from './else';
import schemaThenNonIfLint from './then-non-if';
import schemaElseNonIfLint from './else-non-if';
import schemaAllOfLint from './allof';
import schemaAnyOfLint from './anyof';
import schemaOneOfLint from './oneof';
import schemaNotLint from './not';

const schemaLints = [
  schema$IdLint,
  schema$RefLint,
  schemaTypeLint,
  schemaEnumLint,
  schemaMultipleOfLint,
  schemaMaximumLint,
  schemaMinimumOfLint,
  schemaExclusiveMaximumLint,
  schemaExclusiveMinimumLint,
  schemaMaxLengthLint,
  schemaMinLengthLint,
  schemaMaxLengthNonStringLint,
  schemaMinLengthNonStringLint,
  schemaPatternLint,
  schemaItemsLint,
  schemaItemsNonArrayLint,
  schemaAdditionalItemsLint,
  schemaAdditionalItemsNonArrayLint,
  schemaMaxItemsLint,
  schemaMaxItemsNonArrayLint,
  schemaMinItemsLint,
  schemaMinItemsNonArrayLint,
  schemaUniqueItemsLint,
  schemaUniqueItemsNonArrayLint,
  schemaContainsLint,
  schemaContainsNonArrayLint,
  schemaMaxPropertiesLint,
  schemaMaxPropertiesNonObjectLint,
  schemaMinPropertiesLint,
  schemaMinPropertiesNonObjectLint,
  schemaRequiredLint,
  schemaRequiredNonObjectLint,
  schemaPropertiesLint,
  schemaPropertiesNonObjectLint,
  schemaPatternPropertiesLint,
  schemaPatternPropertiesKeyLint,
  schemaPatternPropertiesNonObjectLint,
  schemaPatternPropertiesObjectLint,
  schemaAdditionalPropertiesLint,
  schemaAdditionalPropertiesNonObjectLint,
  schemaPropertyNamesLint,
  schemaPropertyNamesNonObjectLint,
  schemaPropertiesObjectLint,
  schemaRefNonSiblingsLint,
  schemaFormatLint,
  schemaTitleLint,
  schemaDescriptionLint,
  schemaIfLint,
  schemaIfNonThenLint,
  schemaReadOnlyLint,
  schemaWriteOnlyLint,
  schemaExamplesLint,
  schemaThenLint,
  schemaElseLint,
  schemaThenNonIfLint,
  schemaElseNonIfLint,
  schemaAllOfLint,
  schemaAnyOfLint,
  schemaOneOfLint,
  schemaNotLint,
];

export default schemaLints;
