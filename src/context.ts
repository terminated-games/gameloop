import { isMainThread, parentPort, workerData } from 'worker_threads'
import { Shell } from './shell'
import Container from './container'
import { Thread } from './thread'
import { Util } from './util'
import * as Runtime from './runtime'

export interface Context
{
  readonly Name?: string

  readonly Root: string | any
  readonly Shell: Shell | any
  readonly Controller: string | any

  readonly Thread: Thread | any
}

export const Context: Context = {
  Root: null,
  Shell: null,
  Controller: null,
  Thread: null
}

async function thread(shell: Shell)
{
  Object.defineProperty(Context, 'Root', {
    writable: false,
    configurable: false,
    value: workerData.root
  })

  Object.defineProperty(Context, 'Thread', {
    configurable: false,
    writable: false,
    value: await Thread.fromMessagePort(parentPort)
  })

  module.paths.push(Context.Root)

  console.log('thread root:', Context.Root)

  for (const dependency of shell.dependencies)
  {
    await shell.import(dependency)
  }

  await Runtime.Flush()
}

async function main(shell: Shell)
{
  Object.defineProperty(Context, 'Root', {
    writable: false,
    configurable: false,
    value: Util.getDirectoryOfPath(process.argv[1])
  })

  module.paths.push(Context.Root)

  console.log('root:', Context.Root)

  for (const dependency of shell.dependencies)
  {
    await shell.import(dependency)
  }

  for (let index=0; index<shell.sequence.length; index++)
  {
    let container = shell.sequence[index]

    if (!(container instanceof Container))
    {
      shell.sequence[index] = container = new Container(container.type, container.controller)
    }

    await (container as Container).start(shell)
  }

  await Runtime.Flush()
}

export function Controller(name?: string)
{
  return (target: typeof Shell) => {
    if (Context.Shell)
    {
      throw new Error(`INTERNAL_ERROR: Only one controller per process is allowed`)
    }

    Object.defineProperty(Context, 'Controller', {
      writable: false,
      configurable: false,
      value: process.argv[1]
    })

    const shell: Shell = new target()

    Object.defineProperty(Context, 'Name', {
      writable: false,
      configurable: false,
      value: name
    })

    Object.defineProperty(Context, 'Shell', {
      writable: false,
      configurable: false,
      value: shell
    })

    process.on('uncaughtException', shell.uncaughtException.bind(shell))
    process.on('unhandledRejection', shell.unhandledRejection.bind(shell))

    if (isMainThread)
    {
      main(shell).catch(e => shell.uncaughtException(e))
    } else {
      thread(shell).catch(e => shell.uncaughtException(e))
    }
  }
}
