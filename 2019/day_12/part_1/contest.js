fs = require("fs");

fs.readFile("./2019/day_12/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const STEPS = 1000;
    const DEBUG = false;
    let res = null;

    const regex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
    const moons = data.split("\r\n").map(s => {
        var [, x, y, z] = s.match(regex).map(Number);
        return {pos : {x, y, z}, vel : {x : 0, y : 0, z : 0}};
    });

    const potentialEnergy = moon => Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    const kineticEnergy = moon => Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
    const totalEnergy = moon => potentialEnergy(moon) * kineticEnergy(moon);
    
    for(let step = 0; step < STEPS; step++) {
        for (let i = 0; i < moons.length; i++) {
            const moon1 = moons[i];

            // gravity
            for (let j = i+1; j < moons.length; j++) {
                const moon2 = moons[j];
                for (let k of ["x", "y", "z"]) {
                    if(moon1.pos[k] > moon2.pos[k]) {
                        moon1.vel[k]--;
                        moon2.vel[k]++;
                    }
                    else if(moon1.pos[k] < moon2.pos[k]) {
                        moon1.vel[k]++;
                        moon2.vel[k]--;
                    }
                }
            }

            // velocity
            for (let k of ["x", "y", "z"]) {
                moon1.pos[k] += moon1.vel[k];
            }
        }
    }
    
    res = moons.reduce((acc, m) => acc + totalEnergy(m), 0);
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});