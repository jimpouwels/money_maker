import path from 'path';

export default class ScreenshotUtil {

    static async takeScreenshot(page, filename) {
        await page.screenshot({
            path: path.join(process.cwd(), filename),
            fullPage: true
          })
    }
}