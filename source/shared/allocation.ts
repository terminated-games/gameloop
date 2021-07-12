import * as Threading from 'worker_threads'
import Process from './process'

export default class Allocation
{
  // TODO: Allocate manifest/description buffer of this allocation

  buffer?: SharedArrayBuffer
  length: number = 0

  referencing: Process[] = []

  constructor(bytes: number)
  {
    if (bytes && !Threading.isMainThread)
    {
      throw new Error(`Allocation of bytes only can happen on main thread.`)
    }

    if (bytes && this.buffer == null)
    {
      this.buffer = new SharedArrayBuffer(bytes)
    }
  }

  async extend(bytes: number)
  {
    if (Threading.isMainThread)
    {
      const target = this.length + bytes
      const buffer = new SharedArrayBuffer(target)

      if (this.buffer == null)
      {
        return this.buffer = buffer
      }

      const view = {
        target: new Int8Array(buffer),
        current: new Int8Array(this.buffer)
      }

      view.current.set(view.target, 0)

      return await Promise.all(this.referencing.map(process => process.share(this, target, buffer)))
      .then(() => {
        this.buffer = buffer
        this.length = length
      })
    }

    // TODO: Calling asynchronously the mainThread to extend this buffer and notify everyone
  }
}