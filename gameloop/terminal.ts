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
