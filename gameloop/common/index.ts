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

  export function getRootDirectory(path: string)
  {
    return Path.parse(path).dir
  }
}

export { Shell, Controller } from './shell'
export { Containers, Type as ContainerType, External, Internal } from './container'
