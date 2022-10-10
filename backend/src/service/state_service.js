export default class StateService {

    text = '';
    state = 'Idle';

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    setText(text) {
        this.text = text;
    }

    getText() {
        return this.text;
    }

    isRunning() {
        return this.state === 'Running';
    }
}