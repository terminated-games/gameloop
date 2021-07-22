import { Thread } from './thread'
import { Allocation } from './allocation'

export enum Type
{
  Callback,
  Allocation,
  ExtendAllocation,
  SwapAllocation
}

interface Request
{
  [key: string]: string | number | any | null;
}

export interface Message
{
  type: Type
  callback?: string
  request: Request
}

export async function Handle(thread: Thread, type: Type, request: Request)
{
  switch (type)
  {
    case Type.Callback: return await thread.handleCallback(request.callback, request.error, request.result)
    case Type.ExtendAllocation: return Allocation.extend(request.partition, request.bytes)
    case Type.SwapAllocation: return Allocation.swap(request.partition, request.buffer)

    default: throw new Error(`Protocol.Handle(): Undefined handler type: ${type}`)
  }
}