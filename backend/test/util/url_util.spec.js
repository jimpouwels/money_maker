import UrlUtil from "../../src/util/url_util";

describe("url util", () => {

    it("should parse the passed URL", () => {
        let parsedURL = UrlUtil.parse('http://www.google.com');
    });
});