fs = require("fs");
fs.readFile("./2021/day_16/input.txt", 'utf8', (err, input) => {
    const packet = input;
    part2(packet);
});

const hex2binMap = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
};

const operations = {
    0: (values) => values.reduce((acc, value) => acc + value, 0),
    1: (values) => values.reduce((acc, value) => acc * value, 1),
    2: (values) => Math.min(...values),
    3: (values) => Math.max(...values),
    5: (values) => values[0] > values[1] ? 1 : 0,
    6: (values) => values[0] < values[1] ? 1 : 0,
    7: (values) => values[0] == values[1] ? 1 : 0,
};

part2 = (packet) => console.log(parse([...hex2bin(packet)]));

hex2bin = (value) => {
    const s = [...value].map(hex => hex2binMap[hex]).join('');
    return s.padStart(s.length + s.length % 4, '0');
}

bin2int = (value) => parseInt(value, 2);

parse = (bits) => {;
    _ = getVersion(bits);
    const typeID = getTypeID(bits);

    if (typeID == 4) return getLiteralValue(bits);

    const lengthTypeID = getLengthTypeID(bits);
    const subPacketsValues = [];

    if (lengthTypeID == 0) {
        let subPacketsLength = getSubPacketsLength(bits);

        while (subPacketsLength != 0) {
            const length = bits.length;
            subPacketsValues.push(parse(bits));
            subPacketsLength -= length - bits.length;
        }
    }
    else {
        let subPacketsCount = getSubPacketsCount(bits);

        while (subPacketsCount != 0) {
            subPacketsValues.push(parse(bits));
            subPacketsCount--;
        }
    }

    return operations[typeID](subPacketsValues);
}

getVersion = (bits) => bin2int(bits.splice(0, 3).join(''));
getTypeID = (bits) => bin2int(bits.splice(0, 3).join(''));
getLengthTypeID = (bits) => bin2int(bits.shift());
getSubPacketsLength = (bits) => bin2int(bits.splice(0, 15).join(''));
getSubPacketsCount = (bits) => bin2int(bits.splice(0, 11).join(''));

getLiteralValue = (bits) => {
    const number = [];
    let flag = 1;

    while (flag == 1) {
        flag = bin2int(bits.shift());
        number.push(...bits.splice(0, 4));
    }

    return bin2int(number.join(''));
}