fs = require("fs");
fs.readFile("./2020/day_22/input.txt", 'utf8', (err, input) => {
    console.time();

    const players = {
        P1: 1,
        P2: 2
    };
    const [deck1, deck2] = input.split('\r\n\r\n').map(lines => lines.split('\r\n').slice(1).map(Number));

    const hash = deck => deck.join('');

    let game = 1;
    let str = '';

    const playRound = (deck1, deck2) => {
        const card1 = deck1.shift();
        const card2 = deck2.shift();

        if (card1 <= deck1.length && card2 <= deck2.length) {
            game++;
            const winner = playGame(deck1.slice(0, card1), deck2.slice(0, card2));
            game--;
            if (winner == players.P1) deck1.push(card1, card2);
            else deck2.push(card2, card1);
        }
        else if (card1 > card2) deck1.push(card1, card2);
        else deck2.push(card2, card1);
    }

    const playGame = (deck1, deck2) => {
        let winner = null;
        const played1 = new Set();
        const played2 = new Set();

        let round = 1;

        while (true) {
            const hash1 = hash(deck1);
            const hash2 = hash(deck2);
            if (played1.has(hash1) || played2.has(hash2)) {
                winner = players.P1;
                break;
            }
            played1.add(hash1);
            played2.add(hash2);

            str += `Round ${round} (Game ${game})\r\n`;
            str += `P1 : ${deck1.join(', ')}\r\n`;
            str += `P2 : ${deck2.join(', ')}\r\n`;
            str += '\r\n';
            playRound(deck1, deck2);

            if (deck1.length == 0) {
                winner = players.P2;
                break;
            } else if (deck2.length ==0) {
                winner = players.P1;
                break;
            }

            round++;
        }

        return winner;
    }

    
    const winner = playGame(deck1, deck2) == players.P1 ? deck1 : deck2;
    const response = winner.reduce((acc, card, i) => acc + card * (winner.length - i), 0);

    fs.writeFile(`./2020/day_22/output.txt`, str, function(err) {
        if(err) return console.log(err);
        console.log("The file was saved!");
    });
    console.log(response);
    console.timeEnd();
});
