'use strict'

import crossSpawn from 'cross-spawn'

const closeArgsToError = (code, signal) => {
  if (signal !== null) {
    const err = new Error(`Exited with signal ${signal}`)
    err.exitSignal = signal
    return err
  }
  if (code !== 0) {
    const err = new Error(`Exited with status ${code}`)
    err.exitStatus = code
    return err
  }
  return null
}

const concatBuffer = (buffer) => {
  if (buffer == null || buffer.length === 0) {
    return null
  } else if (typeof buffer[0] === 'string') {
    return buffer.join('')
  } else if (Buffer.isBuffer(buffer[0])) {
    return Buffer.concat(buffer)
  } else {
    throw new Error('Unexpected buffer type')
  }
}

const setEncoding = (stream, encoding) => {
  if (stream != null && encoding != null && typeof stream.setEncoding === 'function') {
    stream.setEncoding(encoding)
  }
}

const prepareStream = (stream, encoding) => {
  if (stream == null) {
    return null
  }
  setEncoding(stream, encoding)
  const buffers = []
  stream.on('data', (data) => {
    buffers.push(data)
  })
  return buffers
}

export default (cmd, args, options = {}) => {
  let childProcess
  const promise = new Promise((resolve, reject) => {
    let encoding
    if (options.encoding != null) {
      encoding = options.encoding
      options = Object.assign({}, options)
      delete options.encoding
    }

    childProcess = crossSpawn(cmd, args, options)

    setEncoding(childProcess.stdin, encoding)
    const stdout = prepareStream(childProcess.stdout, encoding)
    const stderr = prepareStream(childProcess.stderr, encoding)

    childProcess.once('exit', (code, signal) => {
      const error = closeArgsToError(code, signal)
      if (error != null) {
        error.stdout = concatBuffer(stdout)
        error.stderr = concatBuffer(stderr)
        reject(error)
      } else {
        resolve(concatBuffer(stdout))
      }
    })

    childProcess.once('error', reject)
  })
  promise.childProcess = childProcess
  return promise
}
