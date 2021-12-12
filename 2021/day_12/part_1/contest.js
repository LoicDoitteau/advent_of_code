fs = require("fs");
fs.readFile("./2021/day_12/input.txt", 'utf8', (err, input) => {
    const map = input.split('\r\n').reduce((acc, line) => {
        const [a, b] = line.split('-');
        !acc.has(a) && acc.set(a, {big: a == a.toUpperCase(), nodes: []});
        !acc.has(b) && acc.set(b, {big: b == b.toUpperCase(), nodes: []});
        acc.get(a).nodes.push(b);
        acc.get(b).nodes.push(a);
        return acc;
    }, new Map());
    part1(map);
});

part1 = (map) => console.log(getAllPaths(map).length);

getAllPaths = (map) => {
    const paths = [];
    
    const rec = (node, path) => {
        if (node == 'end') {
            paths.push([...path, 'end']);
            return;
        }
        const cave = map.get(node);
        if (!cave.big && path.includes(node)) return;
        
        for (const nextNode of cave.nodes) {
            rec(nextNode, [...path, node]);
        }
    }
    rec('start', []);

    return paths;
}