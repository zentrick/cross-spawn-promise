# cross-spawn-promise

[![npm](https://img.shields.io/npm/v/cross-spawn-promise.svg)](https://www.npmjs.com/package/cross-spawn-promise) [![Dependencies](https://img.shields.io/david/zentrick/cross-spawn-promise.svg)](https://david-dm.org/zentrick/cross-spawn-promise) [![Build Status](https://img.shields.io/travis/zentrick/cross-spawn-promise/master.svg?label=travis+build)](https://travis-ci.org/zentrick/cross-spawn-promise) [![Build Status](https://img.shields.io/appveyor/ci/zentrick/cross-spawn-promise/master.svg?label=appveyor+build)](https://ci.appveyor.com/project/zentrick/cross-spawn-promise) [![Coverage Status](https://img.shields.io/coveralls/zentrick/cross-spawn-promise/master.svg)](https://coveralls.io/r/zentrick/cross-spawn-promise) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

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

## Maintainer

[Tim De Pauw](https://github.com/timdp)

## License

MIT
