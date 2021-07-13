import { Process } from '../process'
import * as Path from 'path'

export default class Shared
{
  // static process_list: Process[] = []

  // static process(entry: string | string[])
  // {
  //   if (!Array.isArray(entry))
  //   {
  //     return this.start(Path.join(process.cwd(), `${entry}.js`))
  //   }

  //   return Promise.all(
  //     entry.map(entry => this.start(Path.join(process.cwd(), `${entry}.js`)))
  //   )
  // }

  // static handleInternalMessage(message: any)
  // {
    
  // }

  // static create(entry: string)
  // {
  //   const process = new Process(entry)

  //   this.process_list.push(process)

  //   return process
  // }

  // static start(entry: string): Promise<Process>
  // {
  //   return this.create(entry).start()
  // }
}
