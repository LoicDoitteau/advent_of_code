fs = require("fs");
fs.readFile("./2021/day_8/input.txt", 'utf8', (err, input) => {
    const entries = input.split('\r\n').map(line => {
        const [input, output] = line.split(' | ');
        return {input: input.split(' '), output: output.split(' ')};
    });
    part2(entries);
});

///  0000
/// 5    1
/// 5    1
///  6666
/// 4    2
/// 4    2
///  3333

const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const numbers = {
    63: 0,
    6: 1,
    91: 2,
    79: 3,
    102: 4,
    109: 5,
    125: 6,
    7: 7,
    127: 8,
    111: 9,
}

part2 = (entries) => {
    const combinations = getCombinations(segments);

    const sum = entries.reduce(
        (acc, entry) => {
            const pattern = combinations.find(pattern => testPattern(entry.input, pattern));
            const value = entry.output.map(wire => getNumber(wire, pattern)).reduce((acc2, number) => acc2 * 10 + number, 0)
            return acc + value;
        },
        0);

    console.log(sum);
};

testPattern = (wires, pattern) => wires.every(wire => getNumber(wire, pattern) != null);

getNumber = (wire, pattern) => numbers[[...wire].reduce((acc, c) => acc | 1 << pattern.indexOf(c), 0)];

getCombinations = (array) => {
    const combinations = [];

    const rec = (arr, cur) => {
        if (arr.length == 0) {
            combinations.push(cur);
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            const newArr = [...arr];
            const element = arr[i];
            newArr.splice(i, 1);
            rec(newArr, cur + element);
        }
    };
    rec(array, '');

    return combinations;
}
