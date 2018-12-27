fs = require("fs");

fs.readFile("./2018/day_23/part_2/input.txt", 'utf8', (err, input) => {
    var startTime = new Date().getTime();

    var p = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/;

    var nanobots = input.split("\r\n").map(s => {
        var [, x, y, z, r] = s.match(p).map(Number);
        return {x, y, z, r};
    });

    var min = nanobots.reduce((acc, n) => {
        if(n.x < acc.x) acc.x = n.x;
        if(n.y < acc.y) acc.y = n.y;
        if(n.z < acc.z) acc.z = n.z;
        return acc;
    }, {x : Infinity, y : Infinity, z : Infinity});

    var max = nanobots.reduce((acc, nanobot) => {
        if(nanobot.x > acc.x) acc.x = nanobot.x;
        if(nanobot.y > acc.y) acc.y = nanobot.y;
        if(nanobot.z > acc.z) acc.z = nanobot.z;
        return acc;
    }, {x : -Infinity, y : -Infinity, z : -Infinity});

    var size = Math.max(Math.abs(max.x - min.x), Math.abs(max.y - min.y), Math.abs(max.z - min.z));
    var w = 1;
    while(w < size) w *= 2;

    var zones = [{x : min.x, y : min.y, z : min.z , w, count : nanobots.length}];

    while(true)
    {     
        var zone = zones.shift();     
        // console.log(zone);

        if(zone.w == 1) {
            console.log(zone, Math.abs(zone.x) + Math.abs(zone.y) + Math.abs(zone.z));
            break;
        }

        var subZones = divide(zone);
        subZones.forEach(subZone => {
            subZone.count = nanobots.filter(nanobot => {
                var dist = 0;
                if(nanobot.x < subZone.x) dist += Math.abs(nanobot.x - subZone.x);
                else if(nanobot.x > subZone.x + subZone.w - 1) dist += Math.abs(nanobot.x - (subZone.x + subZone.w - 1));
                if(nanobot.y < subZone.y) dist += Math.abs(nanobot.y - subZone.y);
                else if(nanobot.y > subZone.y + subZone.w - 1) dist += Math.abs(nanobot.y - (subZone.y + subZone.w - 1));
                if(nanobot.z < subZone.z) dist += Math.abs(nanobot.z - subZone.z);
                else if(nanobot.z > subZone.z + subZone.w - 1) dist += Math.abs(nanobot.z - (subZone.z + subZone.w - 1));
                return dist <= nanobot.r;
            }).length;
        });

        zones.push(...subZones);
        zones.sort((zone1, zone2) => zone1.count != zone2.count ? zone2.count - zone1.count : Math.abs(zone1.x) + Math.abs(zone1.y) + Math.abs(zone1.z) - Math.abs(zone2.x) - Math.abs(zone2.y) - Math.abs(zone2.z));
    }

    var elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

function divide(zone) {
    var w = zone.w / 2;
    var zone1 = {x : zone.x, y : zone.y, z : zone.z, w};
    var zone2 = {x : zone.x, y : zone.y, z : zone.z + w, w};
    var zone3 = {x : zone.x, y : zone.y + w, z : zone.z, w};
    var zone4 = {x : zone.x, y : zone.y + w, z : zone.z + w, w};
    var zone5 = {x : zone.x + w, y : zone.y, z : zone.z, w};
    var zone6 = {x : zone.x + w, y : zone.y, z : zone.z + w, w};
    var zone7 = {x : zone.x + w, y : zone.y + w, z : zone.z, w};
    var zone8 = {x : zone.x + w, y : zone.y + w, z : zone.z + w, w};
    return [zone1, zone2, zone3, zone4, zone5, zone6, zone7, zone8];
}