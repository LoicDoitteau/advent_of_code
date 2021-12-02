fs = require("fs");
fs.readFile("./2021/day_2/input.txt", 'utf8', (err, input) => {
    const regex = /^(?<direction>\w+) (?<step>\d+)$/;
    const rules = input.split('\r\n').map(line => regex.exec(line).groups);
    part2(rules);
});

const directions = {
    'forward': (y, z, aim, step) => ({y: y + step, z: z + aim * step, aim}),
    'up': (y, z, aim, step) => ({y, z, aim: aim - step}),
    'down': (y, z, aim, step) => ({y, z, aim: aim + step}),
};

const part2 = (rules) => {
    let position = {y: 0, z: 0, aim: 0};

    for (const rule of rules) {
        var direction = directions[rule.direction];
        var step = Number(rule.step);
        position = direction(position.y, position.z, position.aim, step);
    }

    console.log(position.y * position.z);
};
