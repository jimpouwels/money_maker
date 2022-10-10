export default class StateService {

    currentState = "";

    setState(state) {
        this.currentState = state;
    }

    getState() {
        return this.currentState;
    }
}