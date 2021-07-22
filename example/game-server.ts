import { Shell, Controller, Sequence, Internal, Util } from '../gameloop'
import { Allocation } from '../gameloop/allocation'

const env = Util.buildProcessArguments<{ namespace: string }>(
  yargs => {
    return yargs.string('namespace')
    .demandOption('namespace')
    .describe('namespace', 'World namespace')
  }
)

const data = Allocation.create('data/item', 1024)

class Gateway extends Internal('gateway/controller.js')
{
  shared: Allocation[] = [
    data
  ]
  
  env: NodeJS.Dict<string> = env
}

class Auth extends Internal('auth/controller.js')
{
  shared: Allocation[] = [
    data
  ]
  
  env: NodeJS.Dict<string> = env
}


class World extends Internal('world/controller.js')
{
  shared: Allocation[] = [
    data
  ]
  
  env: NodeJS.Dict<string> = env
}

class AI extends Internal('ai/controller.js')
{
  shared: Allocation[] = [
    data
  ]
  
  env: NodeJS.Dict<string> = env
}

class ClientInput extends Internal('client-input/controller.js')
{
  shared: Allocation[] = [
    data
  ]
  
  env: NodeJS.Dict<string> = env
}

@Controller()
export default class GameServer extends Shell
{
  sequence: Sequence = [
    new Gateway(),
    new Auth(),

    new AI(),
    new World(),
    new ClientInput()
  ]
}
