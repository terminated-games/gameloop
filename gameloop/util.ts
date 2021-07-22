import yargs from 'yargs'
import * as Path from 'path'

export namespace Util
{
  export type ProcessArgumentBuilder = yargs.Argv
  export type ProcessArguments = yargs.Arguments

  export function processArguments(): ProcessArgumentBuilder {
    return yargs(process.argv.slice(2))
  }

  export function buildProcessArguments<T>(handler: (yargs: ProcessArgumentBuilder) => ProcessArgumentBuilder): T {
    const builder = yargs(process.argv.slice(2))

    const { argv } = handler(builder) as any

    return argv as T
  }

  export function getDirectoryOfPath(path: string)
  {
    const { dir } = Path.parse(path)
    return dir
  }
}