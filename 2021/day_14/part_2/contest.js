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
    part2(pattern, rules);
});

part2 = (pattern, rules) => {
    let pairs = getPairs(pattern);

    for (let i = 0; i < 40; i++) {
        pairs = evolve(pairs, rules);
    }

    let charactersCount = getCharactersCount(pattern, pairs);
    console.log(Math.max(...charactersCount.values()) - Math.min(...charactersCount.values()));
}

getPairs = (pattern) => {
    const pairs = new Map();

    for (let i = 0; i < pattern.length - 1; i++) {
        const cur = pattern[i];
        const next = pattern[i+1];
        const pair = `${cur}${next}`;
        pairs.set(pair, (pairs.get(pair) || 0) + 1);
    }

    return pairs;
}

evolve = (pairs, rules) => {
    const newPairs = new Map();

    for (const [pair, count] of pairs.entries()) {
        const rule = rules.get(pair);
        const pair1 = `${pair[0]}${rule}`;
        const pair2 = `${rule}${pair[1]}`;
        newPairs.set(pair1, (newPairs.get(pair1) || 0) + count);
        newPairs.set(pair2, (newPairs.get(pair2) || 0) + count);
    }

    return newPairs;
}

getCharactersCount = (pattern, pairs) => {
    const characters = new Map([[pattern[pattern.length-1], 1]]);

    for (const [pair, count] of pairs.entries()) {
        const character = pair[0]; 
        characters.set(character, (characters.get(character) || 0) + count);
    }

    return characters;
}
