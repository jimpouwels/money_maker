export default class PlatformUtil {

    public static isDevelopment(): boolean {
        return process.platform === 'darwin';
    }
}
