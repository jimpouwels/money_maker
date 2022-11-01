type QueryParam = { name: string, value: string };

export default class Url {

    private _protocol: string;
    private _host: string;
    private _path: string;
    private _queryString: string;
    private _full: string;
    private _queryParams: QueryParam[];

    public get full(): string {
        return this._full;
    }

    public set full(value: string) {
        this._full = value;
    }

    public get host(): string {
        return this._host;
    }

    public set host(value: string) {
        this._host = value;
    }

    public get path(): string {
        return this._path;
    }

    public set path(value: string) {
        this._path = value;
    }

    public get protocol(): string {
        return this._protocol;
    }

    public set protocol(value: string) {
        this._protocol = value;
    }

    public get queryString(): string {
        return this._queryString;
    }

    public set queryString(value: string) {
        this._queryString = value;
    }

    public get queryParams(): QueryParam[] {
        return this._queryParams;
    }

    public set queryParams(value: QueryParam[]) {
        this._queryParams = value;
    }

    public hasParam(name: string): boolean {
        return this.queryParams.find(qp => qp.name === name) != null;
    }

    public static parse(url: string): Url {
        let parsedUrl = new Url();
        let decodedUrl = url.replace(/&amp;/g, '&');
        parsedUrl.full = decodedUrl;
        if (!url.includes('://')) {
            return;
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