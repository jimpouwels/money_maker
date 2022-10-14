export default class PlatformUtil {

    static isDevelopment() {
        return process.env.MACBOOK === 'true';
    }
}