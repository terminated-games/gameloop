import { Sequence } from './container';
export declare class Shell {
    readonly cwd: string;
    readonly dependencies: string[];
    readonly sequence: Sequence;
    readonly hooks: Function[];
    import(module: string): Promise<any>;
    uncaughtException(error: Error): void;
    unhandledRejection<T>(error: Error, promise: Promise<T>): void;
    static Hook(): (target: any, propertyKey: string) => void;
}
