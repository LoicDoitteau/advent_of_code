fs = require("fs");
fs.readFile("./2019/day_16/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
    let res = null;

    const pattern = [0, 1, 0, -1];
    let input = data.split('');

    const fft = (input, pattern) => input.map((_, i) => (input.reduce((acc, d, j) => acc + Number(d) * pattern[(Math.floor((j + 1) / (i + 1))) % pattern.length], 0).toString().slice(-1)));

    const getNPhase = (input, pattern, n) => {
        let output = input.slice();

        for(let i = 0; i < n; i++) {
            output = fft(output, pattern);
        }

        return output.join('');
    };

    res = getNPhase(input, pattern, 100).substring(0, 8);

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
