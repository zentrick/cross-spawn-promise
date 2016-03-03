'use strict'

import crossSpawn from 'cross-spawn-async'

const parseStdioOption = (value) => {
  let ignoreStdout = false
  let ignoreStderr = false
  if (value === 'ignore') {
    ignoreStdout = true
    ignoreStderr = true
  } else if (Array.isArray(value)) {
    ignoreStdout = (value[1] === 'ignore')
    ignoreStderr = (value[1] === 'ignore')
  }
  return [ignoreStdout, ignoreStderr]
}

export default (cmd, args, options = {}) => new Promise((resolve, reject) => {
  const proc = crossSpawn(cmd, args, options)
  let stdout = null
  let stderr = null
  const [ignoreStdout, ignoreStderr] = parseStdioOption(options.stdio)
  if (!ignoreStdout) {
    stdout = []
    proc.stdout.on('data', (data) => { stdout.push(data) })
  }
  if (!ignoreStderr) {
    stderr = []
    proc.stderr.on('data', (data) => { stderr.push(data) })
  }
  proc.once('close', (code) => {
    if (code !== 0) {
      const err = new Error(`Exited with status ${code}`)
      err.exitStatus = code
      if (!ignoreStderr) {
        err.stderr = Buffer.concat(stderr)
      }
      reject(err)
    } else {
      resolve(ignoreStdout ? null : Buffer.concat(stdout))
    }
  })
})
