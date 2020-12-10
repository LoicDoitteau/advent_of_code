fs = require("fs");
fs.readFile("./2020/day_10/input.txt", 'utf8', (err, input) => {

    const adapters = input.split("\r\n").map(Number).sort((a, b) => a - b);
    const chargingOutlet = 0;
    const device = Math.max(...adapters) + 3;
    const chain = [chargingOutlet, ...adapters, device];
    const differences = {};

    for (let i = 1; i < chain.length; i++) {
        const previous = chain[i - 1];
        const current = chain[i];
        const difference = current - previous;
        if (!differences[difference]) differences[difference] = 0;
        differences[difference]++;
    }

    const response = differences[1] * differences[3];

    console.log(response);
});
