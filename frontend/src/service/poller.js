export default class Poller {

    static TASKS = [];

    static async poll(taskFunction, intervalInMs) {
        await taskFunction();
        Poller.TASKS.push(setInterval(async () => { await taskFunction()}, intervalInMs));
    }

}