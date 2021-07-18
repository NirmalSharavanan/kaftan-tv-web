
export class UrlUtils {
    static formatUrl(inputUrl: string, ...args) {
        return inputUrl.replace(/\{(\d+)\}/g, function (m, n) {
            return args[n];
        });
    }
}
