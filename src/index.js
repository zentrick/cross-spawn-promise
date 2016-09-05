'use strict'

import crossSpawn from 'cross-spawn'

const shouldIgnore = (value) => (value === 'ignore' || value === 'inherit')

const parseStdioOption = (value) => {
  let ignoreStdout = false
  let ignoreStderr = false
  if (shouldIgnore(value)) {
    ignoreStdout = true
    ignoreStderr = true
  } else if (Array.isArray(value)) {
    ignoreStdout = shouldIgnore(value[1])
    ignoreStderr = shouldIgnore(value[2])
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
      if (!ignoreStdout) {
        err.stdout = Buffer.concat(stdout)
      }
      if (!ignoreStderr) {
        err.stderr = Buffer.concat(stderr)
      }
      reject(err)
    } else {
      resolve(ignoreStdout ? null : Buffer.concat(stdout))
    }
  })
  proc.once('error', reject)
})
