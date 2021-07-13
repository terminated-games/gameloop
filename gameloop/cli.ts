#!/usr/bin/env node

import { Util, Shell } from './common'
import * as Path from 'path'

interface Controller
{
  controller: string
}

function ControllerCommand(yargs: Util.ProcessArgumentBuilder)
{
  yargs.positional('controller', {
    describe: 'Filename'
  })
  .demandOption('controller')
}

function CommandStart(arg: Controller)
{
  console.log('command start', arg.controller)

  Shell.start(Path.join(process.cwd(), arg.controller))
  .catch((e: Error) => Shell.unhandledException(e))
}

// function CommandRestart(arg: Util.ProcessArguments)
// {
//   console.log('command restart', arg.controller)
// }

// function CommandStop(arg: Util.ProcessArguments)
// {
//   console.log('command stop', arg.controller)
// }

// function CommandMonit(arg: Util.ProcessArguments)
// {
  
// }

// function CommandList(arg: Util.ProcessArguments)
// {

// }

Util.processArguments()
.command('start [controller]',    'Compiles and runs the project Controller',         ControllerCommand, CommandStart)
// .command('restart [controller]',  'Compiles and restarts the project Controller',     ControllerCommand, CommandRestart)
// .command('stop [controller]',     'Stopping gracefully the project Controller',       ControllerCommand, CommandStop)
// .command('monit [controller]',    'Connects to Controller terminal',                  ControllerCommand, CommandMonit)
// .command('list',                  'Lists all registered controllers',                 undefined,         CommandList)
.strictCommands()
.demandCommand(1, '')
.argv