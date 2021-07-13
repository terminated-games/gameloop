import * as Threading from 'worker_threads'
import { Allocation } from './shared/allocation'
import * as Path from 'path'
import * as uuid from 'uuid'

enum PROCESS_STATE
{
  BUSY,
  ONLINE,
  ERROR,
  OFFLINE
}

export enum INTERNAL
{
  HEADER
}

type id = string;

export class Process
{
  state: PROCESS_STATE

  thread?: Threading.Worker

  filename: string
  option: Threading.WorkerOptions = {}

  callbackQueue: Map<id, { resolve: Function, reject: Function }> = new Map()

  constructor(filename: string)
  {
    this.state = PROCESS_STATE.BUSY
    this.filename = filename
  }

  // share(allocation: Allocation, length: number, buffer: SharedArrayBuffer)
  // {
  //   if (!Threading.isMainThread)
  //   {
  //     throw new Error(`Process.share(allocation: Allocation) Only main thread can share resources`)
  //   }

  //   if (this.state !== PROCESS_STATE.ONLINE)
  //   {
  //     return false
  //   }

  //   return new Promise((resolve, reject) => {
  //     const callback = uuid.v4()

  //     this.callbackQueue.set(callback, { resolve, reject })

  //     console.log('sharing allocation to:', this)

  //     this.thread?.postMessage({
  //       internal: true,
  //       callback,
  //       length,
  //       buffer
  //     })
  //   })
  //   // TODO: This should crash
  //   .then(() => true)
  //   .catch(e => {
  //     console.error(e)

  //     return false
  //   })
  // }

  // handleInternalMessage(message: any)
  // {
  //   console.log('handling internal message')

  //   if (message.callback && Threading.parentPort)
  //   {
  //     Threading.parentPort.postMessage({
  //       internal: true,
  //       callback: message.callback,
  //       result: true
  //     })
  //   }
  // }

  // handle(message: any)
  // {
  //   if (this.state == PROCESS_STATE.ERROR)
  //   {
  //     return false
  //   }

  //   this.state = PROCESS_STATE.BUSY

  //   if (message.internal)
  //   {
  //     this.handleInternalMessage(message)
  //   }

  //   // TODO: Handle internal requests from the processes/shards
  //   // TODO: Request to initialize/fetch references for shared data
  //   // TODO: On response on that the process should initialize model with that data

  //   console.log('handling message:', message)

  //   return true
  // }

  // handleError(e: Error)
  // {
  //   this.state = PROCESS_STATE.ERROR

  //   console.log('handling process error:', e)
  // }

  // close(code: number)
  // {
  //   if (code == 0)
  //   {
  //     this.state = PROCESS_STATE.OFFLINE
  //   }
  // }

  // bind()
  // {
  //   if (this.thread == null)
  //   {
  //     throw new Error(`Process.bind() The process is not constructed`)
  //   }

  //   this.state = PROCESS_STATE.ONLINE

  //   this.thread.on('message', this.handle.bind(this))

  //   this.thread.once('messageerror', this.handleError.bind(this))
  //   this.thread.once('error', this.handleError.bind(this))

  //   this.thread.once('exit', this.close.bind(this))

  //   return this
  // }

  // start()
  // {
  //   return new Promise<Process>((resolve, reject) => {
  //     this.option.workerData = {
  //       filename: this.filename
  //     }

  //     const thread = this.thread = new Threading.Worker(Path.join(__dirname, 'container.js'), this.option)
      
  //     thread.once('error', reject)

  //     thread.once('online', () => {
  //       thread.removeAllListeners('error')

  //       // this.header = Header.alloc(thread.threadId)

  //       // thread.postMessage({
  //       //   internal: INTERNAL.HEADER,
  //       //   buffer: Allocation.get(this.header.getEndpoint())
  //       // })

  //       // Promise.resolve(this.bind())
  //       // .then(resolve)
  //       // .catch(reject)
  //     })
  //   })
  // }
}
