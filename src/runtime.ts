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

export async function Flush()
{
  return await Promise.all(
    Stack.map(
      ({ hook, target, args }) => {
        return hook.apply(target, args)
      }
    )
  )
}