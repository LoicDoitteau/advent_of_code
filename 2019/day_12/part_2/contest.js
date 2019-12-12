fs = require("fs");

fs.readFile("./2019/day_12/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
    let res = null;

    const regex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
    const getMoons = () => data.split("\r\n").map(s => {
        var [, x, y, z] = s.match(regex).map(Number);
        return {pos : {x, y, z}, vel : {x : 0, y : 0, z : 0}};
    });
    const moons = getMoons();

    const keys = ["x", "y", "z"];
    
    const stepOnce = () => {
        for (let i = 0; i < moons.length; i++) {
            const moon1 = moons[i];

            // gravity
            for (let j = i+1; j < moons.length; j++) {
                const moon2 = moons[j];
                for (let k of keys) {
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
            for (let k of keys) {
                moon1.pos[k] += moon1.vel[k];
            }
        }
    }

    const getLoop = () => {
        const loop = {};
        const zero = getMoons();
        let i = 0;
        for (let k of keys) {
            loop[k] = null;
        }

        while(true) {
            i++;
            stepOnce();
            for (let k of keys) {
                if(!loop[k] && moons.every((m, i) => m.pos[k] == zero[i].pos[k] && m.vel[k] == zero[i].vel[k])) loop[k] = i;
            }
            if(keys.every(k => loop[k])) return loop;
        }
    }
    
    const gcd = numbers => {
        const min = Math.min(...numbers.map(n => Math.abs(n)));
        for(let i = min; i > 0; i--) {
            if(numbers.every(n => Number.isInteger(n / i))) return i;
        }
        return 1;
    }

    const lcm = numbers => {
        const g = gcd(numbers);
        return numbers.reduce((acc, n) => acc * n / g, 1);
    }

    const loop = getLoop();
    res = lcm(keys.map(k => loop[k]));
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});