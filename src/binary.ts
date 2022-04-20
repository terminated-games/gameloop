const Type = {
  u8: { size: 1, read: Buffer.prototype.writeUInt8, write: Buffer.prototype.writeUInt8 }
}

// Type.u8

function defineProperty(type: string)
{
  const write = Buffer.prototype[`write${type}`]
  const read = Buffer.prototype[`read${type}`]

  return (target: typeof struct, propertyKey: string) => {
    const offset = target.bytes

    Object.defineProperty(target, propertyKey, {
      configurable: false,
      value: 0,
      get(this: struct) {

      }
    })
  }
}

export function u8()
{
  return (target: struct, propertyKey: string) => {
    // const offset = advanceOffset(target, 1)

    // target.constructor.bytes

    Object.defineProperty(target, propertyKey, {
      configurable: false,
      get(this: struct) {
        // return this.buffer?.readInt8(offset)
      },
      set(this: struct, value: number) {
        // return this.buffer?.writeInt8(value, offset)
      }
    })
  }
}

export class struct
{
  static readonly schema: any[] = []
  static readonly bytes: number = 0

  buffer: Buffer
}

console.log(struct)