import { Sequence } from './container';
export declare class Shell {
    readonly cwd: string;
    readonly dependencies: string[];
    readonly sequence: Sequence;
    import(module: string): Promise<any>;
    uncaughtException(error: Error): void;
    unhandledRejection<T>(error: Error, promise: Promise<T>): void;
}
