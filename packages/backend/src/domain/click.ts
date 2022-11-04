export default class Click {

    private _timestamp: number;
    private _name: string;
    private _account: string;

    public constructor(timestamp: number, name: string, account: string) {
        this.timestamp = timestamp;
        this.name = name;
        this.account = account;
    }

    public get timestamp(): number {
        return this._timestamp;
    }

    public set timestamp(timestamp: number) {
        this._timestamp = timestamp;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get account(): string {
        return this._account;
    }

    public set account(account: string) {
        this._account = account;
    }
}