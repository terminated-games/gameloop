import { Allocation } from './shared/allocation'

function advanceOffset(target: Struct, bytes: number)
{
  const constructor: any = target.constructor
  const offset = constructor.bytes

  constructor.bytes += bytes
  return offset
}

export default class Struct
{
  static readonly bytes: number = 0
  static readonly entry: string = __filename

  private allocation?: Allocation | SharedArrayBuffer
  private _buffer?: Buffer

  swap(allocation: Allocation | SharedArrayBuffer)
  {
    this.allocation = allocation

    if (allocation instanceof SharedArrayBuffer)
    {
      this._buffer = Buffer.from(allocation)
    }
  }

  get buffer(): Buffer | null
  {
    if (this.allocation instanceof Allocation)
    {
      return this.allocation.view || null
    }

    if (this._buffer == null && this.allocation instanceof SharedArrayBuffer)
    {
      return this._buffer = Buffer.from(this.allocation)
    }

    return this._buffer || null
  }

  static string(bytes: number)
  {
    // TODO: 0 bytes string's should be treated as dynamic strings, where 0 is string termination
    // NOTE: But the problem is that we won't know the current offset, if we do that :)

    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, bytes)

      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      Object.defineProperty(target, propertyKey, {
        configurable: false,

        get(this: Struct) {
          return decoder.decode(this.buffer?.slice(offset, bytes))
        },
  
        set(this: Struct, value: string | null)
        {
          this.buffer?.fill(0, offset, bytes)

          if (value)
          {
            const buffer = encoder.encode(value || '')
            this.buffer?.set(buffer.byteLength > bytes ? buffer.slice(0, bytes) : buffer, offset)
          }
        }
      })
    }
  }
  
  static s8()
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 1)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          return this.buffer?.readInt8(offset)
        },
        set(this: Struct, value: number) {
          return this.buffer?.writeInt8(value, offset)
        }
      })
    }
  }

  static u8()
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 1)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          return this.buffer?.readUInt8(offset)
        },
        set(this: Struct, value: number) {
          return this.buffer?.writeUInt8(value, offset)
        }
      })
    }
  }
  
  static s16(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 2)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readInt16LE(offset)
          return this.buffer?.readInt16BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeInt16LE(value, offset)
          return this.buffer?.writeInt16BE(value, offset)
        }
      })
    }
  }

  static u16(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 2)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readUInt16LE(offset)
          return this.buffer?.readUInt16BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeUInt16LE(value, offset)
          return this.buffer?.writeUInt16BE(value, offset)
        }
      })
    }
  }

  static s32(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 4)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readInt32LE(offset)
          return this.buffer?.readInt32BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeInt32LE(value, offset)
          return this.buffer?.writeInt32BE(value, offset)
        }
      })
    }
  }

  static u32(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 4)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readUInt32LE(offset)
          return this.buffer?.readUInt32BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeUInt32LE(value, offset)
          return this.buffer?.writeUInt32BE(value, offset)
        }
      })
    }
  }

  static s64(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 8)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readBigInt64LE(offset)
          return this.buffer?.readBigInt64BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeBigInt64LE(BigInt(value), offset)
          return this.buffer?.writeBigInt64BE(BigInt(value), offset)
        }
      })
    }
  }

  static u64(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 8)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readBigUInt64LE(offset)
          return this.buffer?.readBigUInt64BE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeBigUInt64LE(BigInt(value), offset)
          return this.buffer?.writeBigUInt64BE(BigInt(value), offset)
        }
      })
    }
  }

  static r32(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 4)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readFloatLE(offset)
          return this.buffer?.readFloatBE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeFloatLE(value, offset)
          return this.buffer?.writeFloatBE(value, offset)
        }
      })
    }
  }

  static r64(littleEndian: boolean = true)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, 8)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          if (littleEndian) return this.buffer?.readDoubleLE(offset)
          return this.buffer?.readDoubleBE(offset)
        },
        set(this: Struct, value: number) {
          if (littleEndian) return this.buffer?.writeDoubleLE(value, offset)
          return this.buffer?.writeDoubleBE(value, offset)
        }
      })
    }
  }

  static pad(bytes: number)
  {
    return (target: Struct, propertyKey: string) => {
      const offset = advanceOffset(target, bytes)

      Object.defineProperty(target, propertyKey, {
        configurable: false,
        get(this: Struct) {
          return this.buffer?.slice(offset, bytes)
        },
        set(this: Struct, value: ArrayBuffer | SharedArrayBuffer | Uint8Array) {
          if (this.buffer)
          {
            const buffer = Buffer.from(value)
            buffer.copy(this.buffer, offset, 0, bytes)
          }
        }
      })
    }
  }
}
