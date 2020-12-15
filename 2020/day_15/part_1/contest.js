const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_15/input.txt", 'utf8', (err, input) => {

    const data = input.split(',').map(Number);
    const spoken = data.reduce((acc, number, i) => {
        acc[number] = [i];
        return acc;
    }, []);

    let turn = data.length;
    let lastSpokenNumber = data[turn - 1];

    while (turn < 2020) {
        let number = 0;
        let turnsSpoken = spoken[lastSpokenNumber];
        if (turnsSpoken.length > 1) {
            const [lastLastTurn, lastTurn] = turnsSpoken.slice(-2);
            number = lastTurn - lastLastTurn;
        }

        if (!spoken[number]) spoken[number] = [];
        spoken[number].push(turn);

        lastSpokenNumber = number;
        turn++;
    }

    const response = lastSpokenNumber;
    console.log(response);
});
