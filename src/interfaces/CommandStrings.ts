export default interface CommandStrings {
    description: string;
    extended: string;
    usage: string;
    requiresPermissions: string;
    [prop: string]: string;
}
