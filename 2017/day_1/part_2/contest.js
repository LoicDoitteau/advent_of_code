fs = require("fs");
fs.readFile("./2017/day_1/input.txt", 'utf8', (err, input) => {
    var r = Array
        .from(input)  
        .reduce((acc, x, i) => x == input[(i+input.length/2) % input.length] ? acc + Number(x) : acc, 0);
    console.log(r);
});