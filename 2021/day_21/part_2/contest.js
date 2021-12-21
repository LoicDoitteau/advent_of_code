fs = require("fs");
fs.readFile("./2021/day_21/input.txt", 'utf8', (err, input) => {
    const regex = /^Player (?<id>\d+) starting position: (?<position>\d+)$/
    const players = input.split('\r\n').map(line => objectMap(regex.exec(line).groups, Number));
    part2(players);
});

const SCORE_WIN = 21;

const rolls = [
  1 + 1 + 1,
  2 + 1 + 1,
  3 + 1 + 1,
  1 + 2 + 1,
  2 + 2 + 1,
  3 + 2 + 1,
  1 + 3 + 1,
  2 + 3 + 1,
  3 + 3 + 1,
  1 + 1 + 2,
  2 + 1 + 2,
  3 + 1 + 2,
  1 + 2 + 2,
  2 + 2 + 2,
  3 + 2 + 2,
  1 + 3 + 2,
  2 + 3 + 2,
  3 + 3 + 2,
  1 + 1 + 3,
  2 + 1 + 3,
  3 + 1 + 3,
  1 + 2 + 3,
  2 + 2 + 3,
  3 + 2 + 3,
  1 + 3 + 3,
  2 + 3 + 3,
  3 + 3 + 3,
];

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

part2 = (players) => console.log(Math.max(...play(players).values()));

hash = (players, index, roll) => players.reduce((acc, {position, score}) =>`${acc}(${position},${score || 0})`, `(${index},${roll})`);

play = (players) => {
    let firstPlayerIndex = players.findIndex(({id}) => id == 1);
    const memo = new Map();
    const wins = new Map(players.map(({id}) => [id, 0]));

    const rec = (players, currentPlayerIndex, roll) => {
      const key = hash(players, currentPlayerIndex, roll);
      if (memo.has(key)) return memo.get(key);

      const currentPlayer = players[currentPlayerIndex];
      currentPlayer.position = (currentPlayer.position + roll - 1) % 10 + 1;
      currentPlayer.score = (currentPlayer.score || 0) + currentPlayer.position;
      
      if (currentPlayer.score >= SCORE_WIN) {
        const result = new Map(players.map(({id}) => [id, 0]));
        result.set(currentPlayer.id, 1);
        memo.set(key, result);
        return result
      }      
      
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const result = new Map(players.map(({id}) => [id, 0]));

      for (const roll of rolls) {
        const newResult = rec(copy(players), nextPlayerIndex, roll);
        for (const {id} of players) {
          result.set(id, result.get(id) + newResult.get(id));
        }
      }

      memo.set(key, result);
      return result
    };

    for (const roll of rolls) {
      rec(copy(players), firstPlayerIndex, roll);
    }

    for (const roll of rolls) {
      const key = hash(players, firstPlayerIndex, roll);
      const result = memo.get(key);
      for (const {id} of players) {
        wins.set(id, wins.get(id) + result.get(id));
      }
    }

    return wins;
}

roll = () => Math.round(Math.random() * 3 - 0.5) + 1;

copy = (players) => players.map((player) => ({...player}));
