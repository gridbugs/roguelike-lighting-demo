export const TileDescription = {
    tiles: {
        ClosedWoodenDoor: {
            transparent: true,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgba(0,0,0,0)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(51,35,1)',
            character: '+'
        },
        Lamp: {
            transparent: true,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgba(0,0,0,0)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(204,204,0)',
            character: '£'
        },
        WoodWall: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(102,70,2)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(51,35,1)',
            character: '#'
        },
        NoTile: {
            transparent: false,
            type: 'solid',
            effects: new Set([]),
            colour: 'rgb(255,0,0)'
        },
        Unknown: {
            transparent: false,
            type: 'solid',
            effects: new Set([]),
            colour: 'rgb(0,0,0)'
        },
        Ground: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(6,49,13)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(45,128,16)',
            character: '.'
        },
        StoneFloor: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(68,68,68)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(34,34,34)',
            character: '.'
        },
        Yellow: {
            transparent: true,
            type: 'solid',
            effects: new Set(['TRANSPARENCY_LEVELS']),
            colour: 'rgba(255,255,0,0.25)'
        },
        Water: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(0,68,136)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(34,136,204)',
            character: '~'
        },
        OutOfBounds: {
            transparent: false,
            type: 'solid',
            effects: new Set([]),
            colour: 'rgb(0,0,0)'
        },
        Window: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(80,231,211)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(255,255,255)',
            character: '#'
        },
        Rock: {
            transparent: false,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgb(68,68,68)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(34,34,34)',
            character: '*'
        },
        OpenWoodenDoor: {
            transparent: true,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgba(0,0,0,0)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(51,35,1)',
            character: '-'
        },
        Tree: {
            transparent: true,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgba(0,0,0,0)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(45,128,16)',
            character: '&'
        },
        PlayerCharacter: {
            transparent: true,
            type: 'character',
            font: {
                bold: false,
                name: 'IBM-BIOS',
                size: 16,
                yOffset: -2,
                italic: false,
                xOffset: 1
            },
            backgroundColour: 'rgba(0,0,0,0)',
            effects: new Set(['GREYSCALE', 'LIGHT_LEVELS']),
            colour: 'rgb(255,255,255)',
            character: '@'
        }
    }
}
