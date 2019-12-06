fs = require("fs");
fs.readFile("./2019/day_6/input.txt", 'utf8', (err, data) => {
    const planets = data.split('\r\n').reduce((obj, v) => {
        const [p1, p2] = v.split(')');
        if(obj[p1] == undefined) obj[p1] = {};
        if(obj[p2] == undefined) obj[p2] = {orbit : obj[p1]};
        else obj[p2].orbit = obj[p1];
        return obj;
    }, {});

    const me = planets["YOU"];
    const santa = planets["SAN"];

    const getOrbits = (planet, arr) => {
        if (planet.orbit == undefined) return arr;
        arr.push(planet.orbit);
        return getOrbits(planet.orbit, arr);
    };

    const myOrbits = getOrbits(me, []);
    const santaOrbits = getOrbits(santa, []);

    const getMinOrbitsTransfers = (arr1, arr2) => {
        for (let i = 0; i < arr1.length; i++) {
            const orbit1 = arr1[i];
            for (let j = 0; j < arr2.length; j++) {
                const orbit2 = arr2[j];
                if(orbit1 == orbit2) return i + j;
            }
        }
        return Infinity;
    }

    const res = getMinOrbitsTransfers(myOrbits, santaOrbits);

    console.log(res);
});
