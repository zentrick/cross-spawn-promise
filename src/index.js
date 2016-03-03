'use strict'

import crossSpawn from 'cross-spawn-async'

export default (cmd, args, opt) => new Promise((resolve, reject) => {
  const proc = crossSpawn(cmd, args, opt)
  const stdout = []
  const stderr = []
  proc.stdout.on('data', (data) => {
    stdout.push(data)
  })
  proc.stderr.on('data', (data) => {
    stderr.push(data)
  })
  proc.once('close', (code) => {
    if (code !== 0) {
      const err = new Error(`Exited with status ${code}`)
      err.stderr = Buffer.concat(stderr)
      reject(err)
    } else {
      resolve(Buffer.concat(stdout))
    }
  })
})
