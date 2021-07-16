import { isMainThread, Worker, WorkerOptions } from 'worker_threads'
import { Thread } from './thread'

export enum Type
{
  Internal,
  External
}

interface SpawnOptions
{
  args?: any[]
  execArgs?: string[]
  env?: any
}

export class Container
{
  readonly type: Type
  readonly controller: string

  args: any[] = []
  execArgs: string[] = []
  env: any = {}

  readonly running: Thread[] = []
  
  constructor(type: Type, controller: string)
  {
    this.type = type
    this.controller = controller
  }

  async spawn(entry: SpawnOptions)
  {
    if (!isMainThread)
    {
      throw new Error(`Container.spawn() Requires isMainThread to be true`)
    }

    console.log('spawning:', entry)
  }
}

interface SimpleContainer extends SpawnOptions
{
  type: Type
  controller: string
}

export type Containers = (Container | SimpleContainer)[]

export function Internal(controller: string)
{
  return class Internal extends Container
  {
    constructor()
    {
      super(Type.Internal, controller)
    }
  }
}

export function External(controller: string)
{
  return class External extends Container
  {
    constructor()
    {
      super(Type.External, controller)
    }
  }
}