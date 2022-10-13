export default class Poller {

    static TASKS = [];

    static poll(taskFunction, intervalInMs) {
        taskFunction();
        Poller.TASKS.push(setInterval(async () => {
            taskFunction();
        }, intervalInMs));
    }

}