interface Hook
{
  hook: Function
  target: any
  args: any[]
}

const Mapping: Map<string, Hook[]> = new Map()

const DEFAULT_MAPPING = 'default'

export function Hook(stack: string = DEFAULT_MAPPING, args: any[] = [])
{
  return (target: any, propertyKey?: string) => {
    const hook = propertyKey ? target[propertyKey] : target

    if (typeof hook !== 'function')
    {
      throw new Error(`Runtime.Hook() Requires a valid property type of function`)
    }

    let mapping = Mapping.get(stack)

    if (mapping == null)
    {
      mapping = []
      Mapping.set(stack, mapping)
    }

    mapping.push({ hook, target, args })
  }
}

export async function Flush(stack: string = DEFAULT_MAPPING)
{
  const mapping = Mapping.get(stack)

  if (mapping == null)
  {
    return null
  }

  Mapping.set(stack, [])

  return await Promise.all(
    mapping.map(({ hook, target, args }) => hook.apply(target, args))
  )
}