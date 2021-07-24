const Mapping: Map<string, Function[]> = new Map()

const DEFAULT_MAPPING = 'default'

export function Hook(stack: string = DEFAULT_MAPPING)
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

    mapping.push(hook)
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

  return await Promise.all(mapping)
}