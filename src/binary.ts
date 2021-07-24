export function u8()
{
  return (target: Template, propertyKey: string) => {
    // const offset = advanceOffset(target, 1)

    // target.constructor.bytes

    Object.defineProperty(target, propertyKey, {
      configurable: false,
      get(this: Template) {
        // return this.buffer?.readInt8(offset)
      },
      set(this: Template, value: number) {
        // return this.buffer?.writeInt8(value, offset)
      }
    })
  }
}

export class Template
{
  static readonly schema: any[] = []
  static readonly bytes: number = 0

  
}