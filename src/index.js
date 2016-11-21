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

const concatBuffer = (buffer, encoding) => {
  let result = Buffer.concat(buffer)
  if (encoding === 'utf8') {
    result = result.toString('utf8')
  }
  return result
}

export default (cmd, args, options = {}) => new Promise((resolve, reject) => {
  // Override stdio options for capturing from even 'inherit' or 'ignore'
  const origStdioOptions = options.stdio
  options.stdio = 'pipe'

  let stdout = []
  let stderr = []

  const proc = crossSpawn(cmd, args, options)

  proc.stdout.on('data', (data) => {
    stdout.push(data)
  })

  proc.stderr.on('data', (data) => {
    stderr.push(data)
  })

  // Reattach stdio as parent intended
  ;['stdin', 'stdout', 'stderr'].forEach((std, i, stds) => {
    if (!origStdioOptions) { return }
    const origStd = origStdioOptions instanceof Array && origStdioOptions[i] || origStdioOptions
    if (typeof origStd === 'number') {
      proc[std].pipe(process[stds[origStd]])
    } else if (origStd === 'inherit') {
      proc[std].pipe(process[std])
    }
  })

  proc.once('exit', (code, signal) => {
    const error = closeArgsToError(code, signal)
    if (error !== null) {
      error.stdout = concatBuffer(stdout, options.encoding)
      error.stderr = concatBuffer(stderr, options.encoding)
      reject(error)
    } else {
      resolve(concatBuffer(stdout, options.encoding))
    }
  })
  proc.once('error', reject)
})
