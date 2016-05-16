/* A stack interface backed by an object pool
 *
 * This requires careful use so to avoid concurrent
 * access to entries. Specifically, a value obtained
 * from pop should not be used after thet next call
 * to push.
 */
import {ObjectPool} from 'utils/object_pool';

export class ObjectStack extends ObjectPool {
    constructor(Type, n = 0) {
        super(Type, n = 0);
    }

    /* Returns the newly pushed object with unknown fields */
    push() {
        return this.allocate();
    }

    /* Returns the most recently pushed object. This object
     * reference is valid until the next call to push. */
    pop() {
        --this.index;
        return this.array[this.index];
    }

    get empty() {
        return this.index == 0;
    }

    get length() {
        return this.index;
    }
}
