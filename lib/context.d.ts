import { Shell } from './shell';
import { Thread } from './thread';
export interface Context {
    readonly Name?: string;
    readonly Root: string | any;
    readonly Shell: Shell | any;
    readonly Controller: string | any;
    readonly Thread: Thread | any;
}
export declare const Context: Context;
export declare function Controller(name?: string): (target: typeof Shell) => void;
