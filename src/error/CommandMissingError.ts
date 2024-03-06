
class CommandMissingError extends Error {
    constructor(commandName: string) {
        super(`Command ${commandName} not found`);
        this.name = "CommandMissingError";
        Object.setPrototypeOf(this, CommandMissingError.prototype);
    }
}

export { CommandMissingError };