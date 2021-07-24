import { Sequence } from './container'
import { Context } from './context'
import * as Path from 'path'
import { isMainThread, parentPort } from 'worker_threads'

export class Shell
{
  readonly cwd: string = process.cwd()

  readonly dependencies: string[] = []
  readonly sequence: Sequence = []

  readonly hooks: Function[] = []

  async import(module: string)
  {
    return require(Path.join(Context.Root, module))
  }

  uncaughtException(error: Error)
  {
    if (isMainThread || parentPort == null)
    {
      console.error(error)
      process.exit(0)
    } else {
      throw error
    }
  }

  unhandledRejection<T>(error: Error, promise: Promise<T>)
  {
    if (isMainThread || parentPort == null)
    {
      console.error(error)
      process.exit(0)
    } else {
      throw error
    }
  }

  static Hook()
  {
    return (target: any, propertyKey: string) => {
      Context.Shell.hooks.push(target[propertyKey])
    }
  }
}