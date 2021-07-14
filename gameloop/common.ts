import 'reflect-metadata'
import * as Threading from 'worker_threads'
import yargs from 'yargs'
import * as Path from 'path'

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

  export interface Entry
  {
    readonly type: Type,
    readonly controller: string
  }

  export class Container
  {
    // TODO: Functions to run the container inside a shell with remote shell constructed and waited for the container to setup
  }

  export function Internal(controller: string)
  {
    return class Internal extends Container
    {
      static readonly type: Type = Type.Internal
      static readonly controller: string = controller
    }
  }

  export function External(controller: string)
  {
    return class External extends Container
    {
      static readonly type: Type = Type.External
      static readonly controller: string = controller
    }
  }
}


export interface Shell
{
  readonly root: string
  readonly dependecies: string[]
  readonly sequence: Process.Entry[]

  unhandledRejection<T>(reason: Error, promise: Promise<T>): void
  unhandledException(e: Error): void
}

export abstract class Shell
{
  static readonly cwd: string = process.cwd()

  private static running: Shell | null = null
  private static controller: any

  static paths: string[] = [
    Shell.cwd,
    Path.join(Shell.cwd, 'module'),
    Path.join(Shell.cwd, 'node_modules'),
  ]

  static resolve(module: string, paths: string[] = Shell.paths): string
  {
    for (const path of paths)
    {
      try {
        return require.resolve(Path.join(path, module))
      } catch(e) {
        // TODO: If Shell.debug is set, then trace require paths 
      }
    }

    throw new Error(`MODULE_NOT_FOUND: ${module}`)
  }

  static require(module: string, paths?: string[])
  {
    return require(Shell.resolve(module, paths))
  }

  static requireWithDirectoryResult(module: string, paths?: string[]): string
  {
    const path = Shell.resolve(module, paths)

    require(path)

    return Path.parse(path).dir
  }

  private async import()
  {
    const paths = [
      this.root,
      ...Shell.paths
    ]

    for (const dependency of this.dependecies || [])
    {
      Shell.require(dependency, paths)
    }
  }

  private async main()
  {
    console.log('starting:', this)

    for (const process of this.sequence)
    {
      // const entry: any = process
      // console.log(entry.prototype instanceof Process.Prototype)


      // if (entry.prototype instanceof Process.Prototype)
      // {
      //   const P: typeof Process.Prototype = entry
        
      //   new P()

      //   // await process.start()
      //   // console.log(process.prototype instanceof Process.Prototype)
      // }


      // console.log(process.type, process.controller, process.counter++)

      // console.log(process.type, process.controller, process.constructor)

      // new process()
    }
  }

  private async worker()
  {

  }

  unhandledRejection<T>(reason: Error, promise: Promise<T>)
  {
    console.error('Shell.unhandledRejection():', reason)
    process.exit(0)
  }

  unhandledException(e: Error)
  {
    console.error('Shell.unhandledException():', e)
    process.exit(0)
  }

  static async run(controller: string)
  {
    if (this.isRunning())
    {
      throw new Error(`Shell.start(controller: string): Multiple calls to Shell.start() are prohibited`)
    }

    console.log('Shell.cwd = ', Shell.cwd)
    console.log('Shell.module = ', Path.join(Shell.cwd, 'module'))

    const root = Shell.requireWithDirectoryResult(controller)

    if (this.controller == null)
    {
      throw new Error(`Shell.start(controller: string): Missing @Controller notation in: ${controller}`)
    }

    if (!(this.controller.prototype instanceof Shell))
    {
      throw new Error(`Shell.start(controller: string): Controller is not instance of Shell.`)
    }

    const shell: Shell = this.running = new this.controller()

    Object.defineProperty(shell, 'root', {
      writable: false,
      configurable: false,
      value: root
    })

    process.on('uncaughtException', shell.unhandledException.bind(shell))
    process.on('unhandledRejection', shell.unhandledRejection.bind(shell))

    if (Threading.isMainThread)
    {
      await shell.main()
    } else {
      await shell.worker()
    }

    await shell.import()
  }

  static isRunning(): boolean
  {
    return this.running != null
  }
}

export function Controller(name?: string)
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
