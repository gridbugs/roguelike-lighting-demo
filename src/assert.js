export function assert(assertion, message) {
    if (!assertion) {
        let e = new Error(message);
        console.log(e.stack);
        throw e;
    }
}
