type QueryParam = { name: string, value: string };

export default class Url {

    private _protocol: string;
    private _host: string = '';
    private _path: string = '';
    private _queryString: string = '';
    private _full: string = '';
    private _queryParams: QueryParam[] = [];

    public get full(): string {
        return this._full;
    }

    public set full(full: string) {
        this._full = full;
    }

    public get host(): string {
        return this._host;
    }

    public set host(host: string) {
        this._host = host;
    }

    public get path(): string {
        return this._path;
    }

    public set path(path: string) {
        this._path = path;
    }

    public get protocol(): string {
        return this._protocol;
    }

    public set protocol(protocol: string) {
        this._protocol = protocol;
    }

    public get queryString(): string {
        return this._queryString;
    }

    public set queryString(queryString: string) {
        this._queryString = queryString;
    }

    public get queryParams(): QueryParam[] {
        return this._queryParams;
    }

    public set queryParams(queryParams: QueryParam[]) {
        this._queryParams = queryParams;
    }

    public hasParam(name: string): boolean {
        return this.queryParams.find(qp => qp.name === name) != null;
    }

    public static parse(url: string): Url {
        let parsedUrl = new Url();
        let decodedUrl = decodeURIComponent(url).replace(/&amp;/g, '&');
        parsedUrl.full = decodedUrl;
        if (!url.includes('://')) {
            return parsedUrl;
        }
        let parts = decodedUrl.split('://');
        let hostAndPath = parts[1].replace(/\/\//g, '/').split(/\/(.*)/s);
        const host = hostAndPath[0];
        const pathAndQueryString = hostAndPath.length > 1 ? hostAndPath[1].split('?') : [];
        let path = (pathAndQueryString.length > 0 ? `/${pathAndQueryString[0]}` : '/');
        let queryString = pathAndQueryString.length > 1 ? pathAndQueryString[1] : '';
        const queryParams: QueryParam[] = [];
        for (let queryParam of queryString.split('&')) {
            let queryParamParts = queryParam.split('=');
            queryParams.push({ name: queryParamParts[0], value: queryParamParts[1] });
        }
        parsedUrl.protocol = parts[0];
        parsedUrl.path = path;
        parsedUrl.host = host;
        parsedUrl.queryString = queryString;
        parsedUrl.queryParams = queryParams;
        return parsedUrl;
    }
}