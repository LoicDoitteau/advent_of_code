fs = require("fs");
fs.readFile("./2021/day_18/input.txt", 'utf8', (err, input) => {
    const numbers = input.split('\r\n').map(parseNumber);
    part2(numbers);
});

part2 = (numbers) => {
    const magnitudes = [];

    for (let i = 0; i < numbers.length; i++) {
        const number1 = numbers[i];
        for (let j = i + 1; j < numbers.length; j++) {
            const number2 = numbers[j];
            magnitudes.push(magnitude(add(copy(number1), copy(number2))));
            magnitudes.push(magnitude(add(copy(number2), copy(number1))));
        }
    }

    console.log(Math.max(...magnitudes));
};

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

    while (reduce(number));

    return number;
}

reduce = (number) => {
    const regularNumbers = getRegularNumbers(number);
    const values = regularNumbers.map(n => n.node);

    for (const {node, depth} of regularNumbers) {
        if (depth >= 5) {
            explode(parent(node, number), values);
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
    node.left = {value: Math.floor(node.value / 2)};
    node.right = {value: Math.ceil(node.value / 2)};
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

parent = (node, number) => {
    if (node == number.left || number == number.right) return number;
    if (!isNaN(number.value)) return null;

    return (number.left && parent(node, number.left)) || (number.right && parent(node, number.right));
}

copy = (number) => {
    const copied = {...number};
    if (number.left) copied.left = copy(number.left);
    if (number.right) copied.right = copy(number.right);
    return copied;
}