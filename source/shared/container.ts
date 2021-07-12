import { workerData, isMainThread, parentPort } from 'worker_threads'

if (isMainThread)
{
  throw new Error(`Containers cannot be imported in main thread`)
}

if (!parentPort)
{
  throw new Error(`Containers are required to be ran from main thread as worker`)
}

export class Header
{
  static buffer?: SharedArrayBuffer

  
}

export default class Container
{
  
}

parentPort.on('message', (message) => {
  console.log('on message:', message)
})