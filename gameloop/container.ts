import * as Path from 'path'
import { Shell, Context } from './index'
import { Thread } from './thread'
import { Allocation } from './allocation'

export enum ContainerType
{
  Internal,
  External
}

export interface SimpleContainer
{
  readonly type: ContainerType
  readonly controller: string
}

export type Sequence = ( Container | SimpleContainer )[]

export default class Container implements SimpleContainer
{
  readonly env: NodeJS.Dict<string> = {}

  readonly controller: string
  readonly entry!: string
  readonly type: ContainerType
  readonly running: Thread[] = []
  
  readonly shared: Allocation[] = []

  constructor(type: ContainerType, controller: string)
  {
    this.type = type
    this.controller = controller
  }

  async spawn()
  {
    this.running.push(await Thread.fromContainer(this))
  }

  async start(shell: Shell)
  {
    console.log(Context)
    
    const controller = Path.join(Context.Root, this.controller)

    require.resolve(controller)

    Object.defineProperty(this, 'entry', {
      writable: false,
      configurable: false,
      value: controller
    })

    await this.spawn()
  }
}

export function Internal(controller: string)
{
  return class Internal extends Container
  {
    constructor()
    {
      super(ContainerType.Internal, controller)
    }
  }
}

export function External(controller: string)
{
  return class External extends Container
  {
    constructor()
    {
      super(ContainerType.External, controller)
    }
  }
}