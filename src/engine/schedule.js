import {Heap} from 'utils/heap';

class Task {
    constructor(task, absoluteTime, sequenceNumber, immediate) {
        this.task = task;
        this.absoluteTime = absoluteTime;
        this.sequenceNumber = sequenceNumber;
        this.immediate = immediate;

        this.enabled = true;
    }
}

function compare(a, b) {
    if (a.immediate != b.immediate) {
        return a.immediate - b.immediate;
    }
    if (a.absoluteTime != b.absoluteTime) {
        return b.absoluteTime - a.absoluteTime;
    }
    return b.sequenceNumber - a.sequenceNumber;
}

export class Schedule {
    constructor() {
        this.absoluteTime = 0;
        this.timeDelta = 0;
        this.sequenceNumber = 0;
        this.heap = new Heap(compare);
    }

    flushDisabled() {
        while (!this.heap.peek().enabled) {
            this.heap.pop();
        }
    }

    scheduleTask(f, relativeTime, immediate = false) {
        let task = new Task(
            f,
            this.absoluteTime + relativeTime,
            this.sequenceNumber,
            immediate
        );

        this.heap.insert(task);
        ++this.sequenceNumber;

        return task;
    }

    peek() {
        this.flushDisabled();

        return this.heap.peek();
    }

    pop() {
        this.flushDisabled();

        var entry = this.heap.pop();
        if (!entry.immediate) {
            this.timeDelta = entry.absoluteTime - this.absoluteTime;
            this.absoluteTime = entry.absoluteTime;
        }
        return entry;
    }

    get empty() {
        this.flushDisabled();

        return this.heap.empty;
    }

    hasImmediateTasks() {
        if (this.empty) {
            return false;
        }
        return this.peek().immediate;
    }
}
