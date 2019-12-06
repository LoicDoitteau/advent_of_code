fs = require("fs");
fs.readFile("./2019/day_6/input.txt", 'utf8', (err, data) => {
    const planets = data.split('\r\n').reduce((obj, v) => {
        const [p1, p2] = v.split(')');
        if(obj[p1] == undefined) obj[p1] = {};
        if(obj[p2] == undefined) obj[p2] = {orbit : obj[p1]};
        else obj[p2].orbit = obj[p1];
        return obj;
    }, {});

    const rec = planet => {
        if(planet.length != undefined) return planet.length;
        if (planet.orbit == undefined) planet.length = 0;
        else planet.length = 1 + rec(planet.orbit);
        return planet.length;
    }

    const res = Object.keys(planets).reduce((acc, k) => acc + rec(planets[k]), 0);

    console.log(res);
});
