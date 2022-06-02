import cluster from 'node:cluster'

import { Util } from '@common/util'

let isFirstWorker = true
const TIMEOUT_UP_WORKERS_AFTER_FIRST = 10 * 1000 

const runPrimaryProcess = async () => {
  const processId = process.pid
  const processesCount = 5
  console.log(`Primary ${processId} is running`)
  console.log(`Forking server with ${processesCount} process\n`)

  for (let index = 0; index < processesCount; index++) {
    if (index === 0) {
      const fork = cluster.fork()
      console.log(`Up first worker ${fork.process.pid}`, isFirstWorker)
    } else {
      if (isFirstWorker) {
        console.log(`Awaiting up other Worker ${processId}`)
        isFirstWorker = false
        await Util.delay(TIMEOUT_UP_WORKERS_AFTER_FIRST)
      }

      const fork = cluster.fork()
      console.log(`Await worker ${fork.process.pid}`, isFirstWorker)
    }
  }

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} died... scheduling another one!`)
      cluster.fork()
    }
  })
}

const runWorkerProcess = async () => {
  console.log(`Connecting on database using process ${process.pid}`)
  await import('./database')
  await import('./server')
}

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess()
