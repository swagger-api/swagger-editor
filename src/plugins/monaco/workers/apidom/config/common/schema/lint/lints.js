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
];

export default schemaLints;
