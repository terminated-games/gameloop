import 'reflect-metadata'
import * as Threading from 'worker_threads'
import yargs from 'yargs'

export class Shell
{
  private static running: boolean = false
  private static controller: any

  static async start(controller: string)
  {
    if (this.isRunning())
    {
      throw new Error(`Shell.start(controller: string): Multiple calls to Shell.start() are prohibited`)
    }

    try {
      require(controller)
    } catch(e) {
      throw new Error(`Shell.start(controller: string): ${e.message}`)      
    }

    if (this.controller == null)
    {
      throw new Error(`Shell.start(controller: string): Missing @Controller notation in: ${controller}`)
    }

    if (!(this.controller.prototype instanceof Shell))
    {
      throw new Error(`Shell.start(controller: string): Controller is not instance of Shell.`)
    }

    process.on('uncaughtException', this.controller.unhandledException.bind(this))
    process.on('unhandledRejection', this.controller.unhandledRejection.bind(this))

    // TODO: Singleton reference of controller by calling new?

    this.running = true
  }

  static isRunning()
  {
    return this.running
  }

  static unhandledRejection<T>(reason: Error, promise: Promise<T>)
  {
    console.error('Shell.unhandledRejection():', reason)
    process.exit(0)
  }

  static unhandledException(e: Error)
  {
    console.error('Shell.unhandledException():', e)
    process.exit(0)
  }
}

export namespace Util
{
  export type ProcessArgumentBuilder = yargs.Argv
  export type ProcessArguments = yargs.Arguments

  export function processArguments(): yargs.Argv {
    return yargs(process.argv.slice(2))
  }
}

export namespace Process
{
  export enum Type
  {
    Internal,
    External
  }

  class Base
  {
    static readonly type: Type
    static readonly entry: string
  }

  export class Internal extends Base
  {
    static readonly type: Type = Type.Internal
    
  }

  export class External extends Base
  {
    static readonly type: Type = Type.External
    
  }

  export class Unit
  {

  }
}

export function Controller(name: string | null = null)
{
  return (constructor: any) =>
  {
    const shell: any = Shell

    if (shell.controller)
    {
      throw new Error(`@Controller(): Only one Controller is allowed per process/thread.`)
    }

    shell.controller = constructor
  }
}
