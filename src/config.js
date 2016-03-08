export const Config = {
    TILE_WIDTH: 16,
    TILE_HEIGHT: 16,
    GRID_WIDTH: 64,
    GRID_HEIGHT: 40,
    DEBUG: false,
    RNG_SEED: 1457444012548,
    OMNISCIENT: false,
    DEMO: false,
    AI: true,

    /* Optimization where cells track their last updated time, and this
     * is used by the observation system to determine if it needs to
     * update a character's knowledge of a cell.
     */
    LAZY_KNOWLEDGE: true
};
