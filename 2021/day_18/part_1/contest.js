fs = require("fs");
fs.readFile("./2021/day_18/input.txt", 'utf8', (err, input) => {
    const numbers = input.split('\r\n').map(parseNumber);
    part1(numbers);
});

part1 = (numbers) => console.log(magnitude(numbers.reduce(add)));

parseNumber = (line) => {
    if (line.length == 1) return {value: parseInt(line[0])};

    const number = { };
    let counter = 0;

    for (let cursor = 1; cursor < line.length - 1; cursor++) {
        const charac = line[cursor];
        if (charac == '[') counter++;
        if (charac == ']') counter--;
        if (charac == ',' && counter == 0) {
            number.left = parseNumber(line.substring(1, cursor));
            number.right = parseNumber(line.substring(cursor + 1, line.length - 1));
            number.left.parent = number;
            number.right.parent = number;
            break;
        }
    }

    return number;
}

getRegularNumbers = (number) => {
    const values = [];

    const rec = (node, depth = 0) => {
        if (!isNaN(node.value)) values.push({node, depth});
        else {
            rec(node.left, depth + 1);
            rec(node.right, depth + 1);
        }
    }

    rec(number);
    return values;
}

add = (number1, number2) => {
    const number = { left: number1, right: number2 };

    number1.parent = number;
    number2.parent = number;

    while (reduce(number));

    return number;
}

reduce = (number) => {
    const regularNumbers = getRegularNumbers(number);
    const values = regularNumbers.map(n => n.node);

    for (const {node, depth} of regularNumbers) {
        if (depth >= 5) {
            explode(node.parent, values);
            return true;
        }
    }

    for (const {node} of regularNumbers) {
        if (node.value > 9) {
            split(node);
            return true;
        }
    }

    return false;
}

explode = (node, values) => {
    const leftIndex = values.indexOf(node.left);
    const rightIndex = values.indexOf(node.right);
    if (leftIndex > 0) values[leftIndex - 1].value += node.left.value;
    if (rightIndex < values.length - 1) values[rightIndex + 1].value += node.right.value;
    delete node.left;
    delete node.right;
    node.value = 0;
}

split = (node) => {
    node.left = {value: Math.floor(node.value / 2), parent: node};
    node.right = {value: Math.ceil(node.value / 2), parent: node};
    delete node.value;
}

magnitude = (number) => {
    if (!isNaN(number.value)) return number.value;
    return 3 * magnitude(number.left) + 2 * magnitude(number.right);
}

string = (number) => {
    if (!isNaN(number.value)) return number.value;
    return `[${string(number.left)}, ${string(number.right)}]`;
}