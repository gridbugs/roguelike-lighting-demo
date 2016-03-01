/* This adds a Math.seedrandom function useful for
 * debugging code with random numbers by generating
 * them deterministically. */
import 'seedrandom';

/* Import jquery and expose it as a global symbol */
import $ from 'jquery';
window.$ = $;

/* Run the main function */
import {main} from 'main';
$(main)
