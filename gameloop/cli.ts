#!/usr/bin/env node

import { isMainThread } from 'worker_threads'
import { Util } from './util'
import { Context } from './index'
import * as Path from 'path'

if (!isMainThread)
{
  throw new Error(`INTERNAL_ERROR: Cli can only be included in main process`)
}

Util.processArguments()
.command(
  'start [controller]',
  'path to start the controller',
  async (yargs) => {
    return yargs
    .positional('controller', {
      describe: 'controller to start the gameloop with'
    })
  },
  async (argv: any) => {
    const controller = require.resolve(Path.join(process.cwd(), argv.controller))
    
    Object.defineProperty(Context, 'Controller', {
      writable: false,
      configurable: false,
      value: controller
    })

    Object.defineProperty(Context, 'Root', {
      writable: false,
      configurable: false,
      value: Util.getDirectoryOfPath(controller)
    })

    console.log(Context)

    try {
      require(controller)
    } catch(e) {
      if (Context.Shell)
      {
        return Context.Shell.uncaughtException(e)
      }

      throw e
    }
  }
)
.strictCommands()
.demandCommand(1)
.argv