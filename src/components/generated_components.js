import {Component} from 'engine/component';

export const Door = ARRAY_TUPLE(EXTENDS(Component), open, openTileFamily, closedTileFamily);
export const Tile = ARRAY_TUPLE(EXTENDS(Component), family, depth);
export const WallTile = ARRAY_TUPLE(EXTENDS(Component), frontFamily, topFamily, depth);
export const Opacity = ARRAY_TUPLE(EXTENDS(Component), value);
export const Collider = ARRAY_TUPLE(EXTENDS(Component));
export const Unfamiliar = ARRAY_TUPLE(EXTENDS(Component));
export const Solid = ARRAY_TUPLE(EXTENDS(Component));
export const LightMask = ARRAY_TUPLE(EXTENDS(Component), mask);
export const Velocity = ARRAY_TUPLE(EXTENDS(Component), vector);
export const Bullet = ARRAY_TUPLE(EXTENDS(Component));
