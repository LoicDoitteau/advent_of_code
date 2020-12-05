fs = require("fs");
fs.readFile("./2020/day_5/input.txt", 'utf8', (err, input) => {
    
    const getRange = {
        B: range => ({ ...range, minRow: ((range.maxRow - range.minRow + 1) * 0.5) + range.minRow }),
        F: range => ({ ...range, maxRow: range.maxRow - ((range.maxRow - range.minRow + 1) * 0.5) }),
        L: range => ({ ...range, maxCol: range.maxCol - ((range.maxCol - range.minCol + 1) * 0.5) }),
        R: range => ({ ...range, minCol: ((range.maxCol - range.minCol + 1) * 0.5) + range.minCol }),
    }

    const getID = range => range.maxRow * 8 + range.maxCol;
    const maxID = getID({ maxRow: 127, maxCol: 7 });

    const process = pass => pass.split('').reduce((range, part) => getRange[part](range), { minRow: 0, maxRow: 127, minCol: 0, maxCol: 7 });

    const passes = input.split("\r\n");

    const ids = new Set(passes.map(process).map(getID));

    let response;
    for (let id = 1; id < maxID; id++) {
        if (ids.has(id - 1) && !ids.has(id) && ids.has(id + 1)) {
            response = id;
            break;
        }
    }

    console.log(response);
});
