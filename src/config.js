export const Config = {
    TILE_WIDTH: 16,
    TILE_HEIGHT: 16,
    GRID_WIDTH: 64,
    GRID_HEIGHT: 40,
    DEPTH: 3,
    DEBUG: false,
    RNG_SEED: null,
    OMNISCIENT: true,
    DEMO: false,
    AI: true,

    /* Optimization where cells track their last updated time, and this
     * is used by the observation system to determine if it needs to
     * update a character's knowledge of a cell.
     */
    LAZY_KNOWLEDGE: true,
};
