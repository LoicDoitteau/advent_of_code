const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_12/input.txt", 'utf8', (err, input) => {

    function Boat() {
        this.angle = 90;
        this.x = 0;
        this.y = 0;

        const facing = {
            0: 'N',
            90: 'E',
            180: 'S',
            270: 'W',
        }

        const actions = {
            N: (val) => {
                this.y += val;
            },
            E: (val) => {
                this.x += val;
            },
            S: (val) => {
                this.y -= val;
            },
            W: (val) => {
                this.x -= val;
            },
            F: (val) => {
                actions[facing[this.angle]](val);
            },
            L: (val) => {
                this.angle = (360 + this.angle - val) % 360;
            },
            R: (val) => {
                this.angle = (this.angle + val) % 360;
            }
        };

        return {
            move: (instructions) => {
                for (const { dir, val } of instructions) {
                    actions[dir](Number(val));
                }
                return { x: this.x, y: this.y };
            }
        };
    }
    
    const instructions = input.split("\r\n").map(line => /(?<dir>N|E|S|W|F|L|R)(?<val>\d+)/.exec(line).groups);

    const boat = new Boat();
    const pos = boat.move(instructions);
    const response = Math.abs(pos.x) + Math.abs(pos.y);
    console.log(response);
});
