// TODO: Process registration/reading from config file (cli/process)
// TODO: Cli should keep it within the gameloop running in the background
// TODO: Sharing Allocations and swapping them between processes (internally)
// TODO: Shared memory must wait during swaps
// TODO: Preparing a network running processes/threads to bootup in sequence and waiting for these processes to become online in master process
// TODO: Being able to spawn/create new thread dynamically through balance loader
// TODO: Each process/thread running internally should configure themselves in the network as containers before executing their body to do their things they want
// and acting as balance loaders if they are required to. (only for internal threads)
// TODO: Only internal threads can share buffers

console.log('game server')

import { Controller, Shell, Containers, Internal, External, ContainerType } from '../gameloop/common'

class Gateway extends Internal('gateway/controller')
{

}

@Controller()
export default class GameServer extends Shell
{
  dependencies: string[] = [
    'dependency'
  ]

  containers: Containers = [
    new Gateway,

    { type: ContainerType.Internal, controller: 'gateway/controller' }
  ]
}

// TODO: Initialize shared data

// class Gateway extends Process.Internal('gateway/controller')
// {
//   constructor()
//   {
//     super()

//     console.log('Gateway Container Constructed')
//   }
// }

// @Controller()
// export default class GameServer extends Shell
// {
//   readonly dependecies = [
//     'dependency'
//   ]

//   readonly sequence: Process.Entry[] = [
//     Gateway,

//     // // { type: Process.Type.Internal, controller: 'gateway/controller' },
//     // { type: Process.Type.Internal, controller: 'auth/controller' },

//     // { type: Process.Type.Internal, controller: 'world/controller' },
//     // { type: Process.Type.Internal, controller: 'ai/controller' },
//     // { type: Process.Type.Internal, controller: 'player/controller' }
//   ]
// }
