import { isMainThread, parentPort, workerData } from 'worker_threads'
import { Shell } from './shell'
import Container from './container'
import { Thread } from './thread'

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
  Object.defineProperties(Context, {
    Root: {
      configurable: false,
      writable: false,
      value: workerData.root
    },

    Controller: {
      configurable: false,
      writable: false,
      value: workerData.controller
    }
  })

  const thread = await Thread.fromMessagePort(parentPort)

  Object.defineProperties(Context, {
    Thread: {
      configurable: false,
      writable: false,
      value: thread
    }
  })

  for (const dependency of shell.dependencies)
  {
    await shell.import(dependency)
  }
}

async function main(shell: Shell)
{
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
}

export function Controller(name?: string)
{
  return (target: typeof Shell) => {
    if (Context.Shell)
    {
      throw new Error(`INTERNAL_ERROR: Only one controller per process is allowed`)
    }

    const shell: Shell = new target()

    Object.defineProperties(Context, {
      Name: {
        writable: false,
        configurable: false,
        value: name
      },

      Shell: {
        writable: false,
        configurable: false,
        value: shell
      }
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
