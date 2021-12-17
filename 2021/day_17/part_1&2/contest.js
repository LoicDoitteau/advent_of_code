fs = require("fs");
fs.readFile("./2021/day_17/input.txt", 'utf8', (err, input) => {
    const regex = /^target area: x=(?<xmin>\d+)\.\.(?<xmax>\d+), y=(?<ymin>-\d+)\.\.(?<ymax>-\d+)$/;
    const area = objectMap(regex.exec(input).groups, Number);
    part1(area);
    part2(area);
});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

part1 = (area) => {
    let ymax = 0;
    for (let x = 0; x <= area.xmax; x++) {
        if (nsumlist(x).every(dx => dx < area.xmin || dx > area.xmax)) continue;
        let y = area.ymin;
        let result = launch({x, y}, area);
        while (!result.target) {
            y++;
            result = launch({x, y}, area);
        }
        while (result.target || (result.position.x >= area.xmin && result.position.x <= area.xmax && area.ymin - result.position.y <= area.ymax - area.ymin)) {
            ymax = result.target && result.ymax > ymax ? result.ymax : ymax;
            y++;
            result = launch({x, y}, area);
        }
    }
    console.log(ymax);
};

part2 = (area) => {
    let count = 0;
    for (let x = 0; x <= area.xmax; x++) {
        if (nsumlist(x).every(dx => dx < area.xmin || dx > area.xmax)) continue;
        let y = area.ymin;
        let result = launch({x, y}, area);
        while (!result.target) {
            y++;
            result = launch({x, y}, area);
        }
        while (result.target || (result.position.x >= area.xmin && result.position.x <= area.xmax && area.ymin - result.position.y <= area.ymax - area.ymin)) {
            count += result.target ? 1 : 0;
            y++;
            result = launch({x, y}, area);
        }
    }
    console.log(count);
};

nsum = (n) => {
    let sum = n;
    while (n-- > 0) sum += n;
    return sum;
}

nsumlist = (n) => {
    let sum = n;
    let list = [sum];
    while (n-- > 0) {
        sum += n;
        list.push(sum);
    }
    return list;
}

launch = (velocity, area) => {
    let position = {x: 0, y: 0};
    let ymax = 0;
    let target = false;

    while (position.x <= area.xmax && position.y >= area.ymin) {
        if (inArea(position, area)) {
            target = true;
            break;
        };
        position.x += velocity.x;
        position.y += velocity.y;
        velocity.x -= velocity.x > 0 ? 1 : 0;
        velocity.y -= 1;
        if (position.y > ymax) ymax = position.y;
    }

    return {target, ymax, position};
}

inArea = (position, area) => position.x >= area.xmin && position.x <= area.xmax && position.y >= area.ymin && position.y <= area.ymax;
