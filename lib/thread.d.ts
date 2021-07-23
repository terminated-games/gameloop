/// <reference types="node" />
import { MessagePort } from 'worker_threads';
import Container from './container';
import * as Protocol from './protocol';
export declare class Thread {
    private container;
    private state;
    private process?;
    private queue;
    private callbacks;
    private _handler;
    send(type: Protocol.Type, request: null | any): Promise<void>;
    callback(type: Protocol.Type, request: any): Promise<unknown>;
    handle(): Promise<unknown>;
    handleCallback(uuid: string, error: string | null, result: any): Promise<any>;
    close(): void;
    uncaughtException(e: Error): void;
    static fromMessagePort(channel: MessagePort | null): Promise<Thread>;
    static fromContainer(container: Container): Promise<Thread>;
}
