'use strict'

import crossSpawn from 'cross-spawn-async'

export default (cmd, args, opt) => new Promise((resolve, reject) => {
  const proc = crossSpawn(cmd, args, opt)
  let stdout = ''
  let stderr = ''
  proc.stdout.on('data', (data) => { stdout += data.toString() })
  proc.stderr.on('data', (data) => { stderr += data.toString() })
  proc.once('close', (code) => {
    if (code !== 0) {
      const err = new Error(`Exited with status ${code}`)
      err.stderr = stderr
      reject(err)
    } else {
      resolve(stdout)
    }
  })
})
