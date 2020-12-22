fs = require("fs");
fs.readFile("./2020/day_22/input.txt", 'utf8', (err, input) => {
    console.time();

    const [deck1, deck2] = input.split('\r\n\r\n').map(lines => lines.split('\r\n').slice(1).map(Number));

    const play = () => {
        const card1 = deck1.shift();
        const card2 = deck2.shift();

        if (card1 > card2) deck1.push(card1, card2);
        else deck2.push(card2, card1);
    }

    while (deck1.length > 0 && deck2.length > 0) play();

    const winner = deck1.length == 0 ? deck2 : deck1;

    const response = winner.reduce((acc, card, i) => acc + card * (winner.length - i), 0);
    console.log(response);
    console.timeEnd();
});
