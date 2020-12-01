fs = require("fs");
fs.readFile("./2020/day_1/input.txt", 'utf8', (err, input) => {
    const report = input.split('\r\n').map(Number);
    part1(report);
    part2(report);
});

const part1 = (report) => {
    for (let i = 0; i < report.length; i++) {
        const entry1 = report[i];
        for (let j = i + 1; j < report.length; j++) {
            const entry2 = report[j];
            if (entry1 + entry2 == 2020) {
                console.log(entry1 * entry2);
                return;
            }
        }
    }
};

const part2 = (report) => {
    for (let i = 0; i < report.length; i++) {
        const entry1 = report[i];
        for (let j = i + 1; j < report.length; j++) {
            const entry2 = report[j];
            for (let k = j + 1; k < report.length; k++) {
                const entry3 = report[k];
                if (entry1 + entry2 + entry3 == 2020) {
                    console.log(entry1 * entry2 * entry3);
                    return;
                }
            }
        }
    }
};
