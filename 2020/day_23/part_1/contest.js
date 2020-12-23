fs = require("fs");
fs.readFile("./2020/day_23/input.txt", 'utf8', (err, input) => {
    console.time();

    const TURNS = 100;
    const targetLabel = 1;
    const cups = input.split('').map(n => ({ label: Number(n) }));
    let currentCup = cups[0];

    for (let i = 0; i < cups.length; i++) {
        const cup = cups[i];
        cup.next = cups[(i + 1) % cups.length];
        cup.prev = cups[(i - 1 + cups.length) % cups.length];
    }

    for (let i = 0; i < TURNS; i++) {
        const firstPick = currentCup.next;
        const secondPick = firstPick.next;
        const thirdPick = secondPick.next;

        currentCup.next = thirdPick.next;
        thirdPick.next.prev = currentCup;

        let cup = currentCup.next;
        let labels = [currentCup.label];
        while (cup != currentCup) {
            labels.push(cup.label);
            cup = cup.next;
        }
        labels.sort((a, b) => a - b);
        const destCupLabel = labels[(labels.indexOf(currentCup.label) - 1 + labels.length) % labels.length];
        let destCup = currentCup.next;
        while (destCup.label != destCupLabel) {
            destCup = destCup.next;
        }

        thirdPick.next = destCup.next;
        thirdPick.next.prev = thirdPick;
        firstPick.prev = destCup;
        destCup.next = firstPick;

        currentCup = currentCup.next;
    }

    while (currentCup.label != targetLabel) {
        currentCup = currentCup.next;
    }
    let cup = currentCup.next;
    let response = '';
    while (cup != currentCup) {
        response += cup.label;
        cup = cup.next;
    }

    console.log(response);
    console.timeEnd();
});
