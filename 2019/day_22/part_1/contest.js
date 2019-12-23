fs = require("fs");
fs.readFile("./2019/day_22/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = true;
    const CARDS_COUNT = 10007;
    let res = null;

    const newStack = deck => deck.reverse();

    const cutN = (deck, n) => [...deck.slice(n), ...deck.slice(0, n)];

    const incrementN = (deck, n) => {
        const newDeck = new Array(deck.length);
        const workingDeck = deck.slice();

        let index = 0;
        while(workingDeck.length > 0) {
            const current = workingDeck.shift();
            newDeck[index % newDeck.length] = current;
            index += n;
        }

        return newDeck;
    }

    const techniques = {
        "deal into new stack" : newStack,
        "cut" : cutN,
        "deal with increment" : incrementN
    }

    let deck = Array.from({length : CARDS_COUNT}, (_, i) => i);

    deck = data.split('\r\n').reduce((acc, technique) => {
        let [, s,n] = technique.match(/(deal with increment|cut|deal into new stack)(?: (-?\d+))?/)
        return techniques[s](acc, Number(n));
    }, deck);

    res = deck.indexOf(2019);
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
