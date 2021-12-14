fs = require("fs");
fs.readFile("./2021/day_14/input.txt", 'utf8', (err, input) => {
    const data = input.split('\r\n\r\n');
    const puleRegex = /^(?<pair>\w{2}) -> (?<insert>\w)$/
    const pattern = data.shift(); 
    const rules = data.shift().split('\r\n').reduce(
        (acc, line) => {
            const groups = puleRegex.exec(line).groups;
            acc.set(groups.pair, groups.insert);
            return acc;
        },
        new Map());
    part1(pattern, rules);
});

part1 = (pattern, rules) => {
    let newPattern = pattern;

    for (let i = 0; i < 10; i++) {
        newPattern = evolve(newPattern, rules);
    }

    console.log(getMostCommon(newPattern).count - getLeastCommon(newPattern).count)
}

evolve = (pattern, rules) => {
    const newPattern = [];

    for (let i = 0; i < pattern.length - 1; i++) {
        const cur = pattern[i];
        const next = pattern[i+1];
        newPattern.push(cur, rules.get(`${cur}${next}`));
    }
    newPattern.push(pattern[pattern.length-1]);

    return newPattern.join('');
}

getMostCommon = (pattern) => {
    const characters = new Map();
    let mostCommon = null;

    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        characters.set(char, (characters.get(char) || 0) + 1);
    }

    for (const entry of characters.entries()) {
        if (!mostCommon || mostCommon[1] < entry[1])
            mostCommon = entry;
    }

    return {char: mostCommon[0], count: mostCommon[1]};
}

getLeastCommon = (pattern) => {
    const characters = new Map();
    let leastCommon = null;

    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        characters.set(char, (characters.get(char) || 0) + 1);
    }

    for (const entry of characters.entries()) {
        if (!leastCommon || leastCommon[1] > entry[1])
            leastCommon = entry;
    }

    return {char: leastCommon[0], count: leastCommon[1]};
}