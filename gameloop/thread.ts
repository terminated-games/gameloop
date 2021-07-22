import { isMainThread, Worker, workerData, MessagePort } from 'worker_threads'
import Container from './container'
import { Allocation } from './allocation'
import { Context } from './context'
import * as uuid from 'uuid'

import * as Protocol from './protocol'

enum STATE
{
  INITIALIZING
}

export class Thread
{
  private container: Container | null = null

  private state: STATE = STATE.INITIALIZING

  private process?: Worker | MessagePort
  private queue: Protocol.Message[] = []
  private callbacks: Map<string, { resolve: Function, reject: Function, stack?: string }> = new Map()

  private _handler: Promise<unknown> | null = null

  async send(type: Protocol.Type, request: null | any)
  {
    if (this.process == null)
    {
      throw new Error(`INTERNAL: Unreached connection`)
    }

    this.process.postMessage({
      type,
      request
    })
  }

  async callback(type: Protocol.Type, request: any)
  {
    return new Promise((resolve, reject) => {
      if (this.process == null)
      {
        throw new Error(`INTERNAL: Unreached Message Port`)
      }

      const callback = uuid.v4()

      this.callbacks.set(callback, { resolve, reject })

      this.process.postMessage({
        type,
        callback,
        request
      })
    })
  }

  async handle()
  {
    const [ message ] = this.queue.splice(0, 1)

    if (message == null)
    {
      return void 0
    }

    Protocol.Handle(this, message.type, message.request)
    .then(async result => {
      if (message.callback)
      {
        await this.send(Protocol.Type.Callback, {
          callback: message.callback,
          error: null,
          result
        })
      }
    })
    .catch(async e => {
      if (message.callback)
      {
        return await this.send(Protocol.Type.Callback, {
          callback: message.callback,
          error: e.message,
          result: null
        })
      }

      throw e
    })
    .catch(e => this.uncaughtException(e))

    return await new Promise((resolve, reject) => {
      setImmediate(() => {
        this.handle()
        .then(resolve)
        .catch(reject)
      })
    })
  }

  async handleCallback(uuid: string, error: string | null, result: any)
  {
    const callback = this.callbacks.get(uuid)

    if (callback == null)
    {
      throw new Error(`Thread.popCallback() Missing callback: ${uuid}`)
    }

    this.callbacks.delete(uuid)

    if (error)
    {
      return callback.reject(new Error(error))
    }

    return callback.resolve(result)
  }

  close()
  {
    console.log('thread closed: isMainThread:', isMainThread)
  }
  
  uncaughtException(e: Error)
  {
    console.error(`thread uncaught exception:`, e)
  }

  static async fromMessagePort(channel: MessagePort | null)
  {
    if (channel == null || isMainThread)
    {
      throw new Error(`Access violation: Thread.fromMessagePort() is invalid or called from a Main Thread`)
    }

    for (const { partition, buffer } of workerData.shared)
    {
      Allocation.ensure(partition, buffer)
    }

    const thread = new Thread()

    thread.process = channel

    channel.on('message', (message) => {
      thread.queue.push(message)

      if (thread._handler == null)
      {
        thread._handler = thread.handle()
        .finally(() => {
          thread._handler = null
        })
      }
    })

    channel.on('close', () => {
      console.log('on process channel close')
    })

    return thread
  }

  static async fromContainer(container: Container): Promise<Thread>
  {
    if (!isMainThread)
    {
      throw new Error(`Access violation: Thread.fromContainer() is called from a Main Thread`)
    }

    const thread = new Thread()

    thread.container = container

    const process = thread.process = new Worker(container.entry, {
      env: container.env as NodeJS.Dict<string>,
      workerData: {
        root: Context.Root,
        controller: container.controller,
        shared: container.shared.map(allocation => {
          allocation.shared.push(thread)

          return {
            partition: allocation.partition,
            buffer: allocation.buffer
          }
        })
      }
    })

    return await new Promise((resolve, reject) => {
      process.on('online', () => resolve(thread))
      process.on('error', (e: Error) => reject(e))
    })
    .finally(() => {
      process.removeAllListeners()
    })
    .then(() => {
      process.on('exit', (code) => thread.close())
      process.on('error', (e) => thread.uncaughtException(e))
      process.on('message', (message) => {
        thread.queue.push(message)

        if (thread._handler == null)
        {
          thread._handler = thread.handle()
          .finally(() => {
            thread._handler = null
          })
        }
      })

      return thread
    })
  }
}