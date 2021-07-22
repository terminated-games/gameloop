import { Shell, Controller, Context } from '../../gameloop'

@Controller()
export class Gateway extends Shell
{
  dependencies = [
    'dependency'
  ]
}
