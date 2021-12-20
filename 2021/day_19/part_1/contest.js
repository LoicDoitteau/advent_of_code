const { equal } = require("assert");

fs = require("fs");
fs.readFile("./2021/day_19/input.txt", 'utf8', (err, input) => {
    const regex = /^(?<x>-?\d+),(?<y>-?\d+),(?<z>-?\d+)$/;
    const detections = input.split('\r\n\r\n').map(scans => scans.split('\r\n').slice(1).map(line => objectMap(regex.exec(line).groups, Number)));
    part1(detections);
});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

const OVERLAPS = 12;

const rotations = [
    ({x, y, z}) => ({x, y, z}),

    ({x, y, z}) => ({x: y, y: -x, z}),
    ({x, y, z}) => ({x: -x, y: -y, z}),
    ({x, y, z}) => ({x: -y, y: x, z}),

    ({x, y, z}) => ({x: z, y, z: -x}),
    ({x, y, z}) => ({x: -x, y, z: -z}),
    ({x, y, z}) => ({x: -z, y, z: x}),

    ({x, y, z}) => ({x, y: z, z: -y}),
    ({x, y, z}) => ({x, y: -y, z: -z}),
    ({x, y, z}) => ({x, y: -z, z: y}),
    
    ({x, y, z}) => ({x: z, y: -x, z: -y}),
    ({x, y, z}) => ({x: -y, y: -x, z: -z}),
    ({x, y, z}) => ({x: -z, y: -x, z: y}),
    ({x, y, z}) => ({x: y, y: z, z: x}),
    ({x, y, z}) => ({x: y, y: x, z: -z}),
    ({x, y, z}) => ({x: y, y: -z, z: -x}),

    ({x, y, z}) => ({x: z, y: -y, z: x}),
    ({x, y, z}) => ({x: -z, y: -y, z: -x}),
    ({x, y, z}) => ({x: -x, y: z, z: y}),
    ({x, y, z}) => ({x: -x, y: -z, z: -y}),

    ({x, y, z}) => ({x: z, y: x, z: y}),
    ({x, y, z}) => ({x: -z, y: x, z: -y}),
    ({x, y, z}) => ({x: -y, y: z, z: -x}),
    ({x, y, z}) => ({x: -y, y: -z, z: x}),
],

hash = ({x, y, z}) => `${x}|${y}|${z}`;

part1 = (detections) => {
    const scanners = new Map();
    for (let i = 0; i < detections.length; i++) {
        const detection1 = detections[i];
        for (let j = 0; j < detections.length; j++) {
            if (i == j) continue;
            const detection2 = detections[j];
            for (const rotation of rotations) {
                const result = overlaps(detection1, detection2, rotation);
                if (result) {
                    if (!scanners.has(i)) scanners.set(i, {connections: []});
                    scanners.get(i).connections.push({to: j, ...result});
                    break;
                }
            }
        }
    }

    const scanner0 = scanners.get(0);
    scanner0.position = {x: 0, y: 0, z: 0};
    scanner0.rotation = ({x, y, z}) => ({x, y, z});
    let todo = [scanner0];
    while (todo.length > 0) {
        const current = todo.shift();

        for (const connection of current.connections) {
            const scanner = scanners.get(connection.to);
            if (scanner.position) continue;

            scanner.position = add(current.position, current.rotation(connection.relative));
            scanner.rotation = (position) => current.rotation(connection.rotation(position));
            todo.push(scanner);
        }
    }

    const beacons = new Set();
    for (let i = 0; i < detections.length; i++) {
        const detection = detections[i];
        const scanner = scanners.get(i);
        
        for (const beacon of detection) {
            const position = add(scanner.position, scanner.rotation(beacon));
            beacons.add(hash(position));
        }
    }
    
    console.log(beacons.size);
}

overlaps = (detection1, detection2, rotation) => {
    const map = new Map();
    for (const beacon1 of detection1) {
        for (const beacon2 of detection2) {
            const relative = diff(beacon1, rotation(beacon2));
            const key = hash(relative);
            map.set(key, (map.get(key) || 0) + 1);
            if (map.get(key) >= OVERLAPS) return {relative, rotation};
        }
    }
    return null;
}

add = (position1, position2) => ({x: position1.x + position2.x, y: position1.y + position2.y, z: position1.z + position2.z})

diff = (position1, position2) => ({x: position1.x - position2.x, y: position1.y - position2.y, z: position1.z - position2.z});

dist = (position1, position2) => Math.abs(position1.x - position2.x) + Math.abs(position1.y - position2.y) + Math.abs(position1.z - position2.z);

inverse = ({rotation, relative}) => ({
    rotation: (position) => rotation(rotation(rotation(position))),
    relative: {x: -relative.x, y: -relative.y, z: -relative.z}
});
