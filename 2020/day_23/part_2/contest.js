fs = require("fs");
fs.readFile("./2020/day_23/input.txt", 'utf8', (err, input) => {
    console.time();

    const TURNS = 10000000;
    const TARGET_LABEL = 1;
    const CUPS_COUNT = 1000000;
    const cups = input.split('').map(n => ({ label: Number(n) }));
    const cupsByLabel = new Map();
    let currentCup = cups[0];

    for (let i = cups.length + 1; i <= CUPS_COUNT; i++) {
        cups.push({ label: i });
    }

    for (const cup of cups) {
        cupsByLabel.set(cup.label, cup);
    }

    for (let i = 0; i < CUPS_COUNT; i++) {
        const cup = cups[i];
        cup.next = cups[(i + 1) % CUPS_COUNT];
        cup.prev = cups[(i - 1 + CUPS_COUNT) % CUPS_COUNT];
    }

    for (let i = 0; i < TURNS; i++) {
        const firstPick = currentCup.next;
        const secondPick = firstPick.next;
        const thirdPick = secondPick.next;

        currentCup.next = thirdPick.next;
        thirdPick.next.prev = currentCup;

        let destCupLabel = currentCup.label - 1;
        if (destCupLabel == 0) destCupLabel = CUPS_COUNT;
        let destCup = cupsByLabel.get(destCupLabel);
        while (destCup == firstPick || destCup == secondPick || destCup == thirdPick) {
            if (--destCupLabel == 0) destCupLabel = CUPS_COUNT;
            destCup = cupsByLabel.get(destCupLabel);
        }

        thirdPick.next = destCup.next;
        thirdPick.next.prev = thirdPick;
        firstPick.prev = destCup;
        destCup.next = firstPick;

        currentCup = currentCup.next;
    }

    currentCup = cupsByLabel.get(TARGET_LABEL);
    const response = currentCup.next.label * currentCup.next.next.label
    console.log(response);
    console.timeEnd();
});
