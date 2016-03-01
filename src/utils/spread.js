function *interleave(a, b, nEach) {
    for (let i = 0; i < nEach; ++i) {
        yield a;
        yield b;
    }
}

export function *spread(a, b, nA, nB) {
    // to simplify things, ensure nA >= nB
    if (nA < nB) {
        yield* spread(b, a, nB, nA);
        return;
    }

    // simple case - just interleave
    if (nA == nB) {
        yield* interleave(a, b, nA);
        return;
    }

    // simple case - yield all a
    if (nB == 0) {
        for (let i = 0; i < nA; ++i) {
            yield a;
        }
        return;
    }


    // groups of a are separated by b, so there are nB + 1 groups of a
    var nGroups = nB + 1;

    // determine group sizes
    var smallGroupSize = Math.floor(nA / nGroups);
    var largeGroupSize = smallGroupSize + 1;

    // determine distribution of group sizes
    var nLargeGroups = nA % nGroups;
    var nSmallGroups = nGroups - nLargeGroups;

    var n = nA + nB;
    var k = 0;

    // interleave sizes of groups
    for (let size of spread(smallGroupSize, largeGroupSize, nSmallGroups, nLargeGroups)) {
        for (let i = 0; i < size; ++i) {
            yield a;
            ++k;
        }
        if (k < n) {
            yield b;
            ++k;
        }
    }
}
