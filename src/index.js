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
  if (buffer.length === 0) {
    return null
  } else if (typeof buffer[0] === 'string') {
    return buffer.join('')
  } else if (Buffer.isBuffer(buffer[0])) {
    return Buffer.concat(buffer)
  } else {
    throw new Error('Unexpected buffer type')
  }
}

export default (cmd, args, options = {}) => {
  let childProcess
  const promise = new Promise((resolve, reject) => {
    const encoding = options.encoding
    delete options.encoding

    childProcess = crossSpawn(cmd, args, options)

    let stdout = null
    let stderr = null
    if (childProcess.stdin) {
      if (encoding && childProcess.stdin.setEncoding) {
        childProcess.stdin.setEncoding(encoding)
      }
    }
    if (childProcess.stdout) {
      stdout = []
      if (encoding && childProcess.stdout.setEncoding) {
        childProcess.stdout.setEncoding(encoding)
      }
      childProcess.stdout.on('data', (data) => {
        stdout.push(data)
      })
    }
    if (childProcess.stderr) {
      stderr = []
      if (encoding && childProcess.stderr.setEncoding) {
        childProcess.stderr.setEncoding(encoding)
      }
      childProcess.stderr.on('data', (data) => {
        stderr.push(data)
      })
    }
    childProcess.once('exit', (code, signal) => {
      const error = closeArgsToError(code, signal)
      if (error !== null) {
        if (stdout) {
          error.stdout = concatBuffer(stdout)
        }
        if (stderr) {
          error.stderr = concatBuffer(stderr)
        }
        reject(error)
      } else {
        resolve(stdout && concatBuffer(stdout))
      }
    })
    childProcess.once('error', reject)
  })
  promise.childProcess = childProcess
  return promise
}
