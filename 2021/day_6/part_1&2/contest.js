fs = require("fs");
fs.readFile("./2021/day_6/input.txt", 'utf8', (err, input) => {
    const lanternfishes = input.split(',').map(Number);
    part1(lanternfishes);
    part2(lanternfishes);
});

const part1 = (lanternfishes) => console.log(evolve(lanternfishes, 7, 80));
const part2 = (lanternfishes) => console.log(evolve(lanternfishes, 7, 256));

const hash = (lanternfish, day) => lanternfish << 10 | day;

const evolve = (lanternfishes, birthRate, days) => {
    const memo = new Map();

    const rec = (lanternfish, birthRate, days) => {
        if (days == 0) return 0;
        
        const key = hash(lanternfish, days);
        if (memo.has(key)) return memo.get(key);

        let amount = 0;
    
        while (days-- > 0) {
            if (lanternfish == 0) {
                lanternfish = birthRate;
                amount += 1 + rec(birthRate + 1, birthRate, days);
            }
            
            lanternfish--;
        }
    
        memo.set(key, amount);
        return amount;
    }

    return lanternfishes.reduce(
        (acc, lanternfish) => acc + rec(lanternfish, birthRate, days),
        lanternfishes.length);
}


