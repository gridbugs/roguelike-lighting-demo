export function* detectVisibleAreas(entity, ecsContext) {
    yield entity.cell;
    for (let n of entity.cell.neighbours) {
        yield n;
    }
}
