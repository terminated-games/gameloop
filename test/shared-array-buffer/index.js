const { Worker, isMainThread, parentPort } = require('worker_threads')

if (isMainThread)
{
  const buffer = new SharedArrayBuffer(1024 * 1024 * 512)
  const view = new Int32Array(buffer)

  setInterval(() => {
    view[0]++
  }, 250)

  const array = [
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename),
    new Worker(__filename)
  ]

  for (const worker of array)
  {
    worker.postMessage({ test: buffer })
  }
} else
{
  const shared = {}

  parentPort.on('message', (value) => {
    shared.buffer = new Int32Array(value.test)
  })

  setInterval(() => {
    const start = process.hrtime.bigint()
    const value = shared.buffer[0]
    const counter = Atomics.add(shared.buffer, 1, 1)
    
    const delay = parseInt(process.hrtime.bigint() - start) / 1000000

    console.log(delay, 'ms', 'value:', value, 'counter:', counter)

  }, 1000)
}