import yargs from 'yargs';
export declare namespace Util {
    type ProcessArgumentBuilder = yargs.Argv;
    type ProcessArguments = yargs.Arguments;
    function processArguments(): ProcessArgumentBuilder;
    function buildProcessArguments<T>(handler: (yargs: ProcessArgumentBuilder) => ProcessArgumentBuilder): T;
    function getDirectoryOfPath(path: string): string;
}
