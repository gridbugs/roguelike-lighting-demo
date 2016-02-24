import {Config} from './config.js';

export function initConfigFromUrl() {
    let pairs = window.location.search.split(/[?&\/]/).filter((str) => {return str.length > 0});
    for (let pair of pairs) {
        let [key, value] = pair.split('=');
        if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        }

        Config[key] = value;
    }
}
