import Url from "../../src/domain/url";

describe("url util", () => {

    it("should parse the passed URL", () => {
        let parsedURL = Url.parse('http://www.google.com/thePath?param1=value1&amp;param2=value2&amp;param3=value3');
        expect(parsedURL.host).toEqual('www.google.com');
        expect(parsedURL.protocol).toEqual('http');
        expect(parsedURL.path).toEqual('/thePath');
        expect(parsedURL.queryString).toEqual('param1=value1&param2=value2&param3=value3');
        expect(parsedURL.queryParams[0].name).toEqual('param1');
        expect(parsedURL.queryParams[0].value).toEqual('value1');
        expect(parsedURL.queryParams[1].name).toEqual('param2');
        expect(parsedURL.queryParams[1].value).toEqual('value2');
        expect(parsedURL.full).toEqual('http://www.google.com/thePath?param1=value1&param2=value2&param3=value3');
        expect(parsedURL.hasParam('param1')).toBeTruthy();
        expect(parsedURL.hasParam('param2')).toBeTruthy();
        expect(parsedURL.hasParam('param3')).toBeTruthy();
        expect(parsedURL.hasParam('param4')).toBeFalsy();
    });

    it("should handle urls with double slashes correctly", () => {
        let parsedURL = Url.parse('http://www.google.com0//thePath//test1/test2?param1=value1&amp;param2=value2');
        expect(parsedURL.path).toEqual('/thePath/test1/test2');
    })
});