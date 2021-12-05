fs = require("fs");
fs.readFile("./2021/day_5/input.txt", 'utf8', (err, input) => {
    const regex = /^(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)$/;
    const vents = input.split('\r\n').map(line => objectMap(regex.exec(line).groups, Number));
    part1(vents);
    part2(vents);
});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

  function* filter(iterable) {
    var i = 0;
    for (var item of iterable)
        if (yourPredicate(item, i++))
             yield item;
}

const hash = (x, y) => x << 10 | y;

const part1 = (vents) => {
    var map = new Map();

    for (let {x1, x2, y1, y2} of vents) {
        if (x1 == x2) {
            [y1, y2] = y1 < y2 ? [y1, y2] : [y2, y1];
            for (let y = y1; y <= y2; y++) {
                const key = hash(x1, y);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
        else if (y1 == y2) {
            [x1, x2] = x1 < x2 ? [x1, x2] : [x2, x1];
            for (let x = x1; x <= x2; x++) {
                const key = hash(x, y1);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
    }

    console.log([...map.values()].filter(val => val > 1).length);
};



const part2 = (vents) => {
    var map = new Map();

    for (let {x1, x2, y1, y2} of vents) {
        if (x1 == x2) {
            [y1, y2] = y1 < y2 ? [y1, y2] : [y2, y1];
            for (let y = y1; y <= y2; y++) {
                const key = hash(x1, y);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
        else if (y1 == y2) {
            [x1, x2] = x1 < x2 ? [x1, x2] : [x2, x1];
            for (let x = x1; x <= x2; x++) {
                const key = hash(x, y1);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
        else if (Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
            const dx = x1 < x2 ? 1 : -1;
            const dy = y1 < y2 ? 1 : -1;
            const steps = Math.abs(x1 - x2);

            for (let i = 0; i <= steps; i++) {
                const x = x1 + i * dx;
                const y = y1 + i * dy;
                const key = hash(x, y);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
    }

    console.log([...map.values()].filter(val => val > 1).length);
};
