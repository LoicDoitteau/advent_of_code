fs = require("fs");
fs.readFile("./2021/day_10/input.txt", 'utf8', (err, input) => {
    const lines = input.split('\r\n');
    part2(lines);
});

const closeCharacters = {
    ')': {open: '(', score: 1},
    ']': {open: '[', score: 2},
    '}': {open: '{', score: 3},
    '>': {open: '<', score: 4},
};

const openCharacters = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

part2 = (lines) => {
    const scores = lines
        .map(findCompleteSequence)
        .filter(sequence => sequence.length > 0)
        .map(sequence => sequence.reduce((acc, character) => acc * 5 + closeCharacters[character].score, 0))
        .sort((a, b) => a - b);

    console.log(scores[(scores.length - 1) * 0.5]);
};



findCompleteSequence = (line) => {
    const stack = [];
    
    for (let i = 0; i < line.length; i++) {
        const character = line[i];
        
        if (openCharacters[character]) stack.push(character);
        else if (closeCharacters[character].open == stack[stack.length -1]) stack.pop();
        else return [];
    }

    return stack.reverse().map(character => openCharacters[character]);
}
