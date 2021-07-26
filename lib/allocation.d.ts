/// <reference types="node" />
import { Thread } from './thread';
export declare class Allocation {
    static mapping: Map<string, Allocation>;
    shared: Thread[];
    readonly partition: string;
    buffer?: SharedArrayBuffer;
    view?: Buffer;
    constructor(partition: string);
    extend(bytes: number): Promise<void>;
    share(thread: Thread): Promise<unknown>;
    static extend(partition: string, bytes: number): Promise<void>;
    static create(partition: string, bytes: number): Allocation;
    static swap(partition: string, buffer: SharedArrayBuffer): SharedArrayBuffer | null;
    static ensure(partition: string, buffer: SharedArrayBuffer): Allocation;
    static find(partition: string): Allocation | null;
    static get(partition: string): Allocation;
}
