import { createTerminal, Terminal as TerminalInterface } from 'terminal-kit'

export default class Terminal
{
  static terminal?: TerminalInterface
  static menu: string[] = [ 'Process list', 'Test', 'Test2' ]

  static switch(error: Error, response: any)
  {
    console.log(error, response)
  }

  static start()
  {
    if (this.terminal == null)
    {
      throw new Error(`Terminal.start() Requires constructed terminal. Use Terminal.listen() and not this function directly`)
    }

    const option = {
      y: 1,
      style: this.terminal.inverse,
      selectedStyle: this.terminal.dim.black.bgWhite
    }

    this.terminal.fullscreen(true)
    this.terminal.clear()
    this.terminal.singleLineMenu(this.menu, option, this.switch)
  }

  static listen()
  {
    if (this.terminal)
    {
      return false
    }

    this.terminal = createTerminal()
    this.start()

    return true
  }
}

// enum TERMINAL_STATE
// {
//   READY,
//   WAITING
// }

// const WORKING_ICON = [ '\\', '|', '/', '-' ]

// export default class Terminal
// {
//   static interface: readline.Interface
//   static state: TERMINAL_STATE = TERMINAL_STATE.READY
//   static animating?: NodeJS.Timer
//   static status?: string | null

//   static listen()
//   {
//     if (this.interface)
//     {
//       return false
//     }

//     this.interface = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//       prompt: '> ',
//       terminal: true
//     })

//     this.prompt(TERMINAL_STATE.READY)

//     return true
//   }

//   static update(status: string | null)
//   {
//     this.status = status
    
//     if (this.animating)
//     {
//       clearInterval(this.animating)
//     }

//     let i = 0

//     process.stdout.write(`\r${WORKING_ICON[i++]}${this.status ? ` - ${this.status}` : ` `}`)

//     this.animating = setInterval(() => {
//       process.stdout.write(`\r${WORKING_ICON[i++]}${this.status ? ` - ${this.status}` : ` `}`)
//       i &= 3
//     }, 300)
//   }

//   static prompt(state: TERMINAL_STATE)
//   {
//     this.state = state

//     switch (this.state)
//     {
//       case TERMINAL_STATE.READY:
//         {
//           if (this.animating)
//           {
//             clearInterval(this.animating)
//             this.interface.resume()
//           }

//           this.interface.on('line', this.handle.bind(this))

//           return this.interface.prompt()
//         }

//       case TERMINAL_STATE.WAITING:
//         {
//           this.interface.removeAllListeners()
//           this.interface.pause()

//           return this.update(null)
//         }
//     }
//   }

//   static handle(line: string)
//   {
//     this.prompt(TERMINAL_STATE.WAITING)

//     const [ command, ...args ] = line.toLowerCase().trim().replace(/[\s]+/g, ' ').split(' ')

//     switch (command)
//     {
//       case 'monit':
//         {
//           console.log('monit command! args:', args)
//           break
//         }

//       default: console.error(`Undefined command "${command}".`)
//     }

//     this.prompt(TERMINAL_STATE.READY)
//   }
// }