export default class StateController {

    constructor(app, stateService) {
        app.get('/state', (_req, res) => {
            res.send({ state: stateService.getState() });
        });
    }

}