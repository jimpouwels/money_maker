export default class StateService {

    private _text: string = '';
    private _state: string = 'Idle';

    public set state(state: string) {
        this._state = state;
    }

    public get state(): string {
        return this._state;
    }

    public set text(text: string) {
        this._text = text;
    }

    public get text(): string {
        return this._text;
    }

    public isRunning(): boolean {
        return this.state === 'Running';
    }
}