# pad-stdio [![Build Status](https://travis-ci.org/sindresorhus/pad-stdio.png?branch=master)](https://travis-ci.org/sindresorhus/pad-stdio)

> Pad stdout and stderr

Especially useful with CLI tools when you don't directly control the output.

![](screenshot.png)


## Install

```bash
$ npm install --save pad-stdio
```


## Example

```js
var padStdio = require('pad-stdio');

padStdio.stdout('  ');      // start padding
console.log('foo');
padStdio.stdout('    ');
console.log('bar');
padStdio.stdout();          // end padding
console.log('baz');

/*
  foo
    bar
baz
*/
```

## API

### padStdio.stdout(pad)

Pads each line of `process.stdout` with the supplied pad string until the method is called again with no arguments.

### padStdio.stderr(pad)

Pads each line of `process.stderr` with the supplied pad string until the method is called again with no arguments.


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
