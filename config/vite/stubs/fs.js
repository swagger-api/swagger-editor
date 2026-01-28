// Browser stub for Node.js fs module
// These functions are not actually usable in the browser,
// but are needed to satisfy imports in packages like @asyncapi/parser

export const readFile = () => {
  throw new Error('fs.readFile is not available in the browser');
};

export const readFileSync = () => {
  throw new Error('fs.readFileSync is not available in the browser');
};

export const writeFile = () => {
  throw new Error('fs.writeFile is not available in the browser');
};

export const writeFileSync = () => {
  throw new Error('fs.writeFileSync is not available in the browser');
};

export const existsSync = () => false;

export const stat = () => {
  throw new Error('fs.stat is not available in the browser');
};

export const statSync = () => {
  throw new Error('fs.statSync is not available in the browser');
};

export const readdir = () => {
  throw new Error('fs.readdir is not available in the browser');
};

export const readdirSync = () => {
  throw new Error('fs.readdirSync is not available in the browser');
};

export default {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  existsSync,
  stat,
  statSync,
  readdir,
  readdirSync,
};
