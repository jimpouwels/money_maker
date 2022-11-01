import InvalidUrlError from "../service/money_maker/error/invalid_url_error.js";

export default class UrlUtil {

    static parse(url) {
        if (!url.includes('://')) {
            throw new InvalidUrlError();
        }
        let decodedUrl = url.replaceAll('&amp;', '&');
        let parts = decodedUrl.split('://');
        let domainAndPath = parts[1].replaceAll('//', '/').split(/\/(.*)/s);
        const domain = domainAndPath[0];
        const pathAndQueryString = domainAndPath.length > 1 ? domainAndPath[1].split('?') : [];
        let path = (pathAndQueryString.length > 0 ? `/${pathAndQueryString[0]}` : '/');
        let queryString = pathAndQueryString.length > 1 ? pathAndQueryString[1] : '';
        const queryParams = [];
        for (let queryParam of queryString.split('&')) {
            let queryParamParts = queryParam.split('=');
            queryParams.push({ name: queryParamParts[0], value: queryParamParts[1] });
        }
        return {
            protocol: parts[0],
            host: domain,
            path: path,
            queryString: queryString,
            queryParams: queryParams,
            full: decodedUrl,
            hasParam: (name) => {
                return queryParams.find(qp => qp.name === name) != null
            }
        }
    }

}