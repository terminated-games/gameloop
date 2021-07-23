import { Thread } from './thread';
export declare enum Type {
    Callback = 0,
    Allocation = 1,
    ExtendAllocation = 2,
    SwapAllocation = 3
}
interface Request {
    [key: string]: string | number | any | null;
}
export interface Message {
    type: Type;
    callback?: string;
    request: Request;
}
export declare function Handle(thread: Thread, type: Type, request: Request): Promise<any>;
export {};
