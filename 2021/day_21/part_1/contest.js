fs = require("fs");
fs.readFile("./2021/day_21/input.txt", 'utf8', (err, input) => {
    const regex = /^Player (?<id>\d+) starting position: (?<position>\d+)$/
    const players = input.split('\r\n').map(line => objectMap(regex.exec(line).groups, Number));
    part1(players);
});

const SCORE_WIN = 1000;

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

part1 = (players) => {
    const result = play(players);
    console.log(result.rolls * Math.min(...result.players.map(({score}) => score)));
};

play = (players) => {
    let rolls = 0;
    let currentPlayerIndex = players.findIndex(({id}) => id == 1);

    while (!players.some(({score}) => score >= SCORE_WIN)) {
        const currentPlayer = players[currentPlayerIndex];
        const move = rolls * 3 + 6;
        currentPlayer.position = (currentPlayer.position + move - 1) % 10 + 1;
        currentPlayer.score = (currentPlayer.score || 0) + currentPlayer.position;
        rolls += 3;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    return {players, rolls};
}