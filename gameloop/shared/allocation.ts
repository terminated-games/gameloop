import * as Threading from 'worker_threads'
import * as uuid from 'uuid'

export class Allocation
{
  static mapping: Map<string, Allocation> = new Map()

  readonly partition: string
  buffer?: SharedArrayBuffer
  view?: Buffer

  constructor(partition: string)
  {
    this.partition = partition
  }

  async extend(bytes: number)
  {
    // TODO: Extending allocation from main thread and workers

    if (this.buffer == null)
    {
      throw new Error(`Allocation.extend(bytes: number) Requires a valid buffer<SharedArrayBuffer>`)
    }


  }

  static create(partition: string = uuid.v4(), bytes: number): Allocation
  {
    if (!Threading.isMainThread)
    {
      throw new Error(`Allocation.create(partition: string, bytes: number) Requires a main thread`)
    }

    if (this.mapping.has(partition))
    {
      throw new Error(`Allocation.create(partition: string, bytes: number) Recreation of allocation is prohibited. Allocation: ${partition}`)
    }

    const allocation = new Allocation(partition)

    if (bytes > 0)
    {
      allocation.buffer = new SharedArrayBuffer(bytes)
      allocation.view = Buffer.from(allocation.buffer)
    }

    this.mapping.set(partition, allocation)

    return allocation
  }

  static swap(partition: string, buffer: SharedArrayBuffer): SharedArrayBuffer | null
  {
    const allocation = this.mapping.get(partition)

    if (allocation == null)
    {
      throw new Error(`Allocation.swap(partition: string, buffer: SharedArrayBuffer) Requires a valid partition: ${partition}`)
    }

    const previous = allocation.buffer || null

    allocation.buffer = buffer
    allocation.view = Buffer.from(buffer)

    return previous
  }

  static ensure(partition: string, buffer: SharedArrayBuffer): Allocation
  {
    const allocation = this.mapping.get(partition) || new Allocation(partition)

    allocation.buffer = buffer
    allocation.view = Buffer.from(buffer)

    if (!this.mapping.has(partition))
    {
      this.mapping.set(partition, allocation)
    }
    
    return allocation
  }

  static find(partition: string): Allocation | null
  {
    return this.mapping.get(partition) || null
  }

  static get(partition: string): Allocation
  {
    const allocation = this.mapping.get(partition)

    if (allocation == null)
    {
      throw new Error(`Allocation.get(partition: string) Missing allocation: ${partition}`)
    }

    return allocation
  }
}
