export default class PlatformUtil {

    static isDevelopment() {
        return process.platform === 'darwin';
    }
}