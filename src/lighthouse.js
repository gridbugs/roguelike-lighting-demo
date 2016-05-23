import {Controller} from 'controller';
import {Actions} from 'actions';
import {Turn} from 'engine/turn';
import {degreesToRadians as d2r} from 'utils/angle';

const STEP = d2r(-5);

export class Lighthouse extends Controller {
    takeTurn() {
        return new Turn(
            new Actions.DirectionalLightTurn(
                this.entity, STEP));
    }
}
