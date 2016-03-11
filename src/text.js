export function renderText(stringArray) {
    return stringArray.map((x) => {return `${x}<br/>`}).join('<br/>');
}

export const HelpText = [
    'Movement: arrow keys/numpad (numlock off)/hjklyubn (vi keys)',
    'Wait: .',
    'Ascend: &lt;',
    'Descend: &gt;',
    'Fire: f, movement keys to navigate, enter or f to fire',
    'Open/Close: c',
    'Get Item: g',
    'Examine: x, movement keys to navigate, enter or x for details',
    'Prev/Next Weapon: w/e',
    'Select Weapon: 1-5',
    'Show this screen: ?'
]

export const WinText = [
    'You teleport off the ship.',
    '',
    "You materialize on Earth. You're not sure how long you've been away, but you're relieved to be back.",
    '',
    "You think back on your time aboard the ship. Why did the crew turn undead? Something in the air? In the water? Something transmitted through bites, like in some old horror film? Either way, you weren't bitten, right? You didn't get infected like the rest of the crew. And there's no chance that any of the undead came through the teleporter with you...",
    '',
    "Yep. Safely back on Earth. It's sure good to be home.",
    '',
    '',
    'Press any key to play again.'
];
