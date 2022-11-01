import UrlUtil from "../../src/util/url_util";

describe("url util", () => {

    it("should parse the passed URL", () => {
        let parsedURL = UrlUtil.parse('http://www.google.com/thePath?param1=value1&amp;param2=value2');
        expect(parsedURL.host).toEqual('www.google.com');
        expect(parsedURL.protocol).toEqual('http');
        expect(parsedURL.path).toEqual('/thePath');
        expect(parsedURL.queryString).toEqual('param1=value1&param2=value2');
        expect(parsedURL.queryParams[0].name).toEqual('param1');
        expect(parsedURL.queryParams[0].value).toEqual('value1');
        expect(parsedURL.queryParams[1].name).toEqual('param2');
        expect(parsedURL.queryParams[1].value).toEqual('value2');
        expect(parsedURL.full).toEqual('http://www.google.com/thePath?param1=value1&param2=value2');
        expect(parsedURL.hasParam('param1')).toBeTruthy();
        expect(parsedURL.hasParam('param2')).toBeTruthy();
        expect(parsedURL.hasParam('param3')).toBeFalsy();
    });
});