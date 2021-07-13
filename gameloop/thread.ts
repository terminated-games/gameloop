import { workerData, isMainThread, parentPort } from 'worker_threads'
import * as Process from './process'

if (isMainThread)
{
  throw new Error(`Containers cannot be imported in main thread`)
}

if (!parentPort)
{
  throw new Error(`Containers are required to be ran from main thread as worker`)
}

// export const Header: Process.Header = new Process.Header()

// export default class Container
// {
  
// }

parentPort.on('message', (message) => {
  // console.log('on message:', message)

  // if (message.internal == null)
  // {
  //   console.log('its not set')
  // }

  // switch (message.internal)
  // {
  //   case Process.INTERNAL.HEADER:
  //     {
  //       // Header.swap(message.buffer)

  //       // console.log(Header.endpoint, Header.threadId)
  //     } break
  // }
})