fs = require("fs");
fs.readFile("./2021/day_10/input.txt", 'utf8', (err, input) => {
    const lines = input.split('\r\n');
    part1(lines);
});

const closeCharacters = {
    ')': {open: '(', score: 3},
    ']': {open: '[', score: 57},
    '}': {open: '{', score: 1197},
    '>': {open: '<', score: 25137},
};

const openCharacters = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

part1 = (lines) => console.log(
    lines
        .map(findFirstIllegalCharacter)
        .filter(character => character != null)
        .map(character => closeCharacters[character].score)
        .reduce((a, b) => a + b)
);


findFirstIllegalCharacter = (line) => {
    const stack = [];
    
    for (let i = 0; i < line.length; i++) {
        const character = line[i];
        
        if (openCharacters[character]) stack.push(character);
        else if (closeCharacters[character].open == stack[stack.length -1]) stack.pop();
        else return character;
    }

    return null;
}
