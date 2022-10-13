export default  class LoggerService {

    static LINES = [];

    static log(msg) {
        let finalMsg = new Date().toISOString();
        finalMsg += ` ${msg}`;
        console.log(finalMsg)
        LoggerService.LINES.unshift(finalMsg);
    }

    static clear() {
        this.LINES = [];
    }

    static getLines() {
        return LoggerService.LINES;
    }

}