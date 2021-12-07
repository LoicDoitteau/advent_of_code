fs = require("fs");
fs.readFile("./2021/day_7/input.txt", 'utf8', (err, input) => {
    const crabs = input.split(',').map(Number);
    part1(crabs);
    part2(crabs);
});

const part1 = (crabs) => console.log(align(crabs, (from, to) => Math.abs(from - to)));
const part2 = (crabs) => console.log(align(
    crabs,
    (from, to) => {
        let dist = Math.abs(from - to);
        let consumption = 0;
        while (dist > 0) consumption += dist--;
        return consumption
    }));

const hash = (from, to) => from < to ? from << 11 | to : to << 11 | from;

const align = (crabs, consumption) => {
    const memo = new Map();

    const rec = (from, to) => {
        if (from == to) return 0;
        
        const key = hash(from, to);
        if (memo.has(key)) return memo.get(key);

        let fuel = consumption(from, to);
    
        memo.set(key, fuel);
        return fuel;
    }

    const min = Math.min(...crabs);
    const max = Math.max(...crabs);

    let minConsumption = null;

    for (let to = min; to <= max; to++) {
        const consumption = crabs.reduce((acc, from) => acc + rec(from, to), 0);
        minConsumption = minConsumption && consumption > minConsumption ? minConsumption : consumption
    }

    return minConsumption;
}


