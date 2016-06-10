import {constrain} from 'utils/arith';
import {Vec2} from 'utils/vec2';

export function getWindowOffset(realX, realY, realWidth, realHeight, screenWidth, screenHeight) {
    let maxWindowX = realWidth - screenWidth;
    let maxWindowY = realHeight - screenHeight;

    let relativeWindowX = realX - screenWidth / 2;
    let relativeWindowY = realY - screenHeight / 2;

    let windowX = constrain(0, relativeWindowX, maxWindowX);
    let windowY = constrain(0, relativeWindowY, maxWindowY);

    return new Vec2(windowX, windowY);
}
