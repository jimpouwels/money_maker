export default  class LoggerService {

    public static LINES: string[] = [];

    public static log(msg: string): void {
        let timestampedMsg = LoggerService.createTimestampedLogLine(msg);
        console.log(timestampedMsg)
        LoggerService.LINES.unshift(timestampedMsg);
    }

    public static logError(msg: string, error: Error): void {
        let timestampedMsg = LoggerService.createTimestampedLogLine(`${msg}: ${error}`);
        console.log(msg, error)
        LoggerService.LINES.unshift(timestampedMsg);
    }

    public static clear(): void {
        this.LINES = [];
    }

    public static getLines(): string[] {
        return LoggerService.LINES;
    }

    public static createTimestampedLogLine(msg: string): string {
        return `${new Date().toISOString()} ${msg}`
    }

}