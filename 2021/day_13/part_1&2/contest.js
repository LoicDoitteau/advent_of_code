fs = require("fs");
fs.readFile("./2021/day_13/input.txt", 'utf8', (err, input) => {
    const data = input.split('\r\n\r\n');
    const dotRegex = /^(?<x>\d+),(?<y>\d+)$/
    const instructionRegex = /^fold along (?<axe>x|y)=(?<value>\d+)$/
    const dots = data[0].split('\r\n').map(line => objectMap(dotRegex.exec(line).groups, Number));
    const instructions = data[1].split('\r\n').map(line => objectMap(instructionRegex.exec(line).groups, (v) => isNaN(Number(v)) ? v : Number(v)));
    part1(dots, instructions);
    part2(dots, instructions);
});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

const hash = (x, y) => x << 11 | y;  

fold = (dots, instruction) => {
    const newDots = [];
    const done = new Set();

    for (const dot of dots) {
        if (dot[instruction.axe] < instruction.value) {
            const key = hash(dot.x, dot.y);
            if (!done.has(key)) {
                newDots.push(dot);
                done.add(key);
            }
        }
        else {
            const newDot = {...dot};
            newDot[instruction.axe] = instruction.value - (newDot[instruction.axe] - instruction.value);
            const key = hash(newDot.x, newDot.y);
            if (!done.has(key)) {
                newDots.push(newDot);
                done.add(key);
            }
        }
    }

    return newDots;
}

const part1 = (dots, instructions) => console.log(fold(dots, instructions[0]).length);

const part2 = (dots, instructions) => {
    const folded = instructions.reduce((acc, instruction) => fold(acc, instruction), dots);
    fs.writeFile("./2021/day_13/output.txt", toString(folded), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

toString = (dots) => {
    const xMin = Math.min(...dots.map(dot => dot.x));
    const xMax = Math.max(...dots.map(dot => dot.x));
    const yMin = Math.min(...dots.map(dot => dot.y));
    const yMax = Math.max(...dots.map(dot => dot.y));

    var grid = Array.from({length : yMax - yMin + 1}, _ => Array.from({length : xMax - xMin+ 1}, _ => '.'));
    for (const {x, y} of dots) {
        grid[y - yMin][x - xMin] = '#';
    }

    return grid.reduce((acc, row) => acc + row.join('') + '\n', '');
}
