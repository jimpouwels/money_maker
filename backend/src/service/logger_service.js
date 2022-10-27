export default  class LoggerService {

    static LINES = [];

    static log(msg) {
        let timestampedMsg = LoggerService.createTimestampedLogLine(msg);
        console.log(timestampedMsg)
        LoggerService.LINES.unshift(timestampedMsg);
    }

    static logError(msg, error) {
        let timestampedMsg = LoggerService.createTimestampedLogLine(`${msg}: ${error}`);
        console.log(msg, error)
        LoggerService.LINES.unshift(timestampedMsg);
    }

    static clear() {
        this.LINES = [];
    }

    static getLines() {
        return LoggerService.LINES;
    }

    static createTimestampedLogLine(msg) {
        return `${new Date().toISOString()} ${msg}`
    }

}