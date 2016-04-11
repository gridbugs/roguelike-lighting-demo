export class Turn {
    constructor(action, time = 1, reschedule = true) {
        this.action = action;
        this.time = time;
        this.reschedule = reschedule;
    }
}
