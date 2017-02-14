# cross-spawn-promise

[![npm](https://img.shields.io/npm/v/cross-spawn-promise.svg)](https://www.npmjs.com/package/cross-spawn-promise) [![Dependencies](https://img.shields.io/david/zentrick/cross-spawn-promise.svg)](https://david-dm.org/zentrick/cross-spawn-promise) [![Linux Build Status](https://img.shields.io/circleci/project/github/zentrick/cross-spawn-promise/master.svg?label=linux+build)](https://circleci.com/gh/zentrick/cross-spawn-promise) [![Windows Build Status](https://img.shields.io/appveyor/ci/zentrick/cross-spawn-promise/master.svg?label=windows+build)](https://ci.appveyor.com/project/zentrick/cross-spawn-promise) [![Coverage Status](https://img.shields.io/coveralls/zentrick/cross-spawn-promise/master.svg)](https://coveralls.io/r/zentrick/cross-spawn-promise) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Promisified [cross-spawn](https://www.npmjs.com/package/cross-spawn).

## Usage

```js
import spawn from 'cross-spawn-promise'

const command = 'ls'
const args = ['-al', '/etc']
const options = {}
spawn(command, args, options)
  .then((stdout) => {
    console.info('Success!')
    console.info('stdout:', stdout.toString())
  })
  .catch((error) => {
    console.error('Failed!')
    console.error('exit status:', error.exitStatus)
    console.error('stderr:', error.stderr.toString())
  })
```

## API

```js
async spawn(command[, args][, options])
```

The returned `Promise` will resolve to the process's standard output. Depending
on the value of the `encoding` option (see below), it will either be a
[`Buffer`](https://nodejs.org/api/buffer.html) or a string.

The promise also exposes the created child process via its `childProcess`
property.

Upon rejection, the following properties provide additional information on the
`Error` object:

- `exitSignal`
- `exitStatus`
- `stdout`
- `stderr`

## Options

All options are passed on to
[cross-spawn](https://www.npmjs.com/package/cross-spawn), with the exception of
the additional `encoding` option. If you pass a string (e.g., `'utf8'`), it will
be used as the
[default character encoding](https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding).

## Maintainer

[Tim De Pauw](https://github.com/timdp)

## License

MIT
