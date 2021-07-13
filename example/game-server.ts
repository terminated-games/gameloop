// TODO: Process registration/reading from config file (cli/process)
// TODO: Cli should keep it within the gameloop running in the background
// TODO: Sharing Allocations and swapping them between processes (internally)
// TODO: Shared memory must wait during swaps
// TODO: Preparing a network running processes/threads to bootup in sequence and waiting for these processes to become online in master process
// TODO: Being able to spawn/create new thread dynamically through balance loader
// TODO: Each process/thread running internally should configure themselves in the network as containers before executing their body to do their things they want
// and acting as balance loaders if they are required to. (only for internal threads)
// TODO: Only internal threads can share buffers

import { Controller, Process, Shell } from '../gameloop/common'

class Geometry extends Process.External
{
  // readonly entry: string = 'process/geometry'
}

@Controller()
export default class GameServer extends Shell
{
  static unhandledException(e: Error)
  {
    console.log('unhandled exception:', e)
  }
}
