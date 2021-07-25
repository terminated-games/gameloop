interface Hook
{
  hook: Function
  target: any
  args: any[]
}

const Stack: Hook[] = []

export function Hook(args: any[] = [])
{
  return (target: any, propertyKey?: string) => {
    const hook = propertyKey ? target[propertyKey] : target

    if (typeof hook !== 'function')
    {
      throw new Error(`Runtime.Hook() Requires a valid property type of function`)
    }

    Stack.push({ hook, target, args })
  }
}

export function Constructor(args: any[] = [])
{
  return (target: any, propertyKey: string) => {
    const hook = propertyKey ? target[propertyKey] : target

    if (typeof hook !== 'function')
    {
      throw new Error(`Runtime.Hook() Requires a valid property type of function`)
    }

    const constructor = target.constructor

    if (typeof constructor !== 'function')
    {
      throw new Error(`Runtime.Constructor() Requires a valid target constructor function`)
    }

    target.constructor = function Runtime (..._args: any[]) {
      constructor(..._args)

      Stack.push({ hook, target: this, args })
    }
  }
}

export async function Flush()
{
  
}