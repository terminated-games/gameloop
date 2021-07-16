import 'reflect-metadata'

import { isMainThread } from 'worker_threads'
import { Util } from '.'
import * as Path from 'path'
import { Container, Containers } from './container'

export abstract class Shell
{
  static readonly cwd: string = process.cwd()
  static readonly Controller: Shell

  static resolve(target: string, root?: string)
  {
    const paths = [
      Shell.cwd,
      Path.join(Shell.cwd, 'module')
    ]

    if (root)
    {
      paths.push(root)
    }

    for (const path of paths)
    {
      try {
        return require.resolve(Path.join(path, target))
      } catch(e) {
        // TODO: Debug require path, where pathing takes
        continue
      }
    }

    return require.resolve(target)
  }

  readonly root: string
  readonly name: string | null = Reflect.getMetadata('name', Shell) || null
  readonly dependencies: string[] = []
  readonly containers: Containers = []

  constructor(root: string)
  {
    this.root = root
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

  async import(target: string)
  {
    return await require(Shell.resolve(target, this.root))
  }
}

export function Controller(name?: string)
{
  return (constructor: any) => {
    Reflect.defineMetadata('name', name, Shell)
    Reflect.defineMetadata('controller', constructor, Shell)
  }
}

if (isMainThread)
{
  async function CommandStart(result: { controller: string })
  {
    const path = Shell.resolve(result.controller)

    require(path)

    const Controller: any = Reflect.getMetadata('controller', Shell)

    if (Controller == null)
    {
      throw new Error(`Shell: Controller object not found in metadata.`)
    }

    const shell: Shell = new Controller(Util.getRootDirectory(path))
    
    process.on('uncaughtException', shell.unhandledException.bind(shell))
    process.on('unhandledRejection', shell.unhandledRejection.bind(shell))

    Object.defineProperty(Shell, 'Controller', {
      configurable: false,
      writable: false,
      value: shell
    })

    for (const dependency of shell.dependencies)
    {
      await shell.import(dependency)
    }

    for (let Index=0; Index<shell.containers.length; Index++)
    {
      const entry: any = shell.containers[Index]

      if (!(entry instanceof Container))
      {
        const container = shell.containers[Index] = new Container(entry.type, entry.controller)
        
        await container.spawn(entry)

        continue
      }

      await entry.spawn(entry)
    }
  }

  Util.processArguments()
  .command(
    'start [controller]',
    'Compiles and runs the project Controller',
    (yargs: Util.ProcessArgumentBuilder) => {
      yargs.positional('controller', {
        describe: 'Filename'
      })
      .demandOption('controller')
    },
    (result: { controller: string }) => CommandStart(result)
    .catch(e => {
      console.error(e)
      process.exit(0)
    })
  )
  .strictCommands()
  .demandCommand(1, '')
  .argv
} else {
  console.log('internal shell:', Shell)
}
