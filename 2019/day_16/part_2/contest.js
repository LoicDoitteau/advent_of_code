fs = require("fs");
fs.readFile("./2019/day_16/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
    let res = null;

    const pattern = [0, 1, 0, -1];
    const offset = Number(data.substring(0, 7));
    let input = "";
    for(let i = 0 ; i < 10000; i++) {
        input += data;
    }

    if(DEBUG) console.log(`Only +1 pattern ? ${offset > input.length * 0.5}`);

    input = input.split('').slice(offset).map(Number);

    for(let phase = 0; phase < 100; phase++) {
        for(let i = input.length - 2; i >= 0; i--) {
            input[i] = (input[i] + input[i + 1]) % 10;
        }
    }

    res = input.slice(0, 8).join('');
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});