fs = require("fs");
fs.readFile("./2020/day_8/input.txt", 'utf8', (err, input) => {
    
    function GameConsole() {
        this.accumulator = 0;
        this.pointer = 0;

        const operations = {
            acc: (val) => {
                this.accumulator += val;
                this.pointer++;
            },
            jmp: (val) => {
                this.pointer += val;
            },
            nop: () => {
                this.pointer++;
            }
        };

        return {
            boot: (instructions) => {
                this.accumulator = 0;
                this.pointer = 0;
                const done = new Set();

                while (true) {
                    if (done.has(this.pointer))
                        return this.accumulator;
                    const { op, val } = instructions[this.pointer];
                    done.add(this.pointer);
                    operations[op](val);
                }
            }
        };
    }

    const instructions = input.split("\r\n").map(line => {
        const [ op, val ] = line.split(' ');
        return { op, val: Number(val) };
    });
    const game = new GameConsole();

    const response = game.boot(instructions);

    console.log(response);
});
