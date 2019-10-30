fs = require("fs");
fs.readFile("./2017/day_2/input.txt", 'utf8', (err, input) => {
    let r = input
        .split("\r\n")
        .map(row => row
            .match(/\d+/g)
            .map(x => Number(x)))
            .map(row2 => {
                for(let i = 0; i < row2.length; i++) {
                    const x = row2[i];
                    for (let j = 0; j < row2.length; j++) {
                        if(i == j) continue;
                        let d = x / row2[j];
                        if(Number.isInteger(d)) return d;
                    }
                }
                return 0;
            })
        .reduce((acc, x) => acc + x);
    console.log(r);
});