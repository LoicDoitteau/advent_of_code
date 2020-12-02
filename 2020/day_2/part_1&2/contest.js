fs = require("fs");
fs.readFile("./2020/day_2/input.txt", 'utf8', (err, input) => {
    const regex = /(?<min>\d+)-(?<max>\d+) (?<letter>\w): (?<password>\w+)/;

    const database = input.split("\r\n").map(s => {
        return regex.exec(s).groups;
    });

    // const response = part1(database);
    const response = part2(database);

    console.log(response);
});

const part1 = (database) => database.reduce((acc, entry) => {
    let { min, max, letter, password } = entry;
    min = Number(min);
    max = Number(max);

    const count = password.split('').filter(c => c == letter).length;
    if (min <= count && count <= max) acc++;
    return acc;
}, 0);

const part2 = (database) => database.reduce((acc, entry) => {
    let { min, max, letter, password } = entry;
    min = Number(min) - 1;
    max = Number(max) - 1;

    if ((password[min] == letter && password[max] != letter)
        || (password[min] != letter && password[max] == letter)) acc++;
    return acc;
}, 0);
