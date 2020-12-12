const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_12/input.txt", 'utf8', (err, input) => {

    function Boat() {
        this.x = 0;
        this.y = 0;
        this.waypointDx = 10;
        this.waypointDy = 1;

        const actions = {
            N: (val) => {
                this.waypointDy += val;
            },
            E: (val) => {
                this.waypointDx += val;
            },
            S: (val) => {
                this.waypointDy -= val;
            },
            W: (val) => {
                this.waypointDx -= val;
            },
            F: (val) => {
                this.x += val * this.waypointDx;
                this.y += val * this.waypointDy;
            },
            L: (val) => {
                const angle = -val * Math.PI / 180;
                const newWaypointDx = this.waypointDx * Math.cos(angle) + this.waypointDy * Math.sin(angle);
                const newWaypointDy = -this.waypointDx * Math.sin(angle) + this.waypointDy * Math.cos(angle);
                this.waypointDx = Math.round(newWaypointDx);
                this.waypointDy = Math.round(newWaypointDy);
            },
            R: (val) => {
                const angle = val * Math.PI / 180;
                const newWaypointDx = this.waypointDx * Math.cos(angle) + this.waypointDy * Math.sin(angle);
                const newWaypointDy = -this.waypointDx * Math.sin(angle) + this.waypointDy * Math.cos(angle);
                this.waypointDx = Math.round(newWaypointDx);
                this.waypointDy = Math.round(newWaypointDy);
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
