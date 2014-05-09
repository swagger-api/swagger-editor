# lpad [![Build Status](https://travis-ci.org/sindresorhus/lpad.png?branch=master)](https://travis-ci.org/sindresorhus/lpad)

> Left pad each line in a string

![screenshot](screenshot.png)


## Install

```bash
$ npm install --save lpad
```

## Example

```js
var lpad = require('lpad');

var str = 'foo\nbar';
/*
foo
bar
*/

lpad(str, '    ');
/*
    foo
    bar
*/
```


## API

### lpad(string, pad)

Pads each line in a string with the supplied pad string.


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
