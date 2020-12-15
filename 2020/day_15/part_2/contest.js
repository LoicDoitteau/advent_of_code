const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_15/input.txt", 'utf8', (err, input) => {

    const data = input.split(',').map(Number);
    const spoken = data.reduce((acc, number, i) => {
        acc.set(number, { lastTurn: i });
        return acc;
    }, new Map());

    let turn = data.length;
    let lastSpokenNumber = data[turn - 1];

    while (turn < 30000000) {
        let number = 0;
        let turnsSpoken = spoken.get(lastSpokenNumber);
        if (turnsSpoken.lastLastTurn != undefined) {
            const { lastLastTurn, lastTurn } = turnsSpoken;
            number = lastTurn - lastLastTurn;
        }

        if (!spoken.has(number)) spoken.set(number, { lastTurn: turn });
        else {
            const turns = spoken.get(number);
            turns.lastLastTurn = turns.lastTurn;
            turns.lastTurn = turn;
        };

        lastSpokenNumber = number;
        turn++;
    }

    const response = lastSpokenNumber;
    console.log(response);
});
