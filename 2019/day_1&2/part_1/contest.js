fs = require("fs");
fs.readFile("./2019/day_1/input.txt", 'utf8', (err, input) => {
    var r = input.split('\r\n').reduce((acc, n) => acc + getFuel_part2(Number(n)), 0);
    console.log(r);
});

function getFuel_part1(mass){
    let fuel = Math.floor(mass / 3) - 2;
    if(fuel <= 0) return 0;
    return fuel;
}

function getFuel_part2(mass){
    let fuel = Math.floor(mass / 3) - 2;
    if(fuel <= 0) return 0;
    return fuel + getFuel(fuel);
}