fs = require("fs");
fs.readFile("./2020/day_9/input.txt", 'utf8', (err, input) => {

    const XMAS = input.split("\r\n").map(Number);
    const preambleCount = 25;

    const hack = () => {
        for (let i = 0; i < XMAS.length - preambleCount; i++) {
            const preamble = XMAS.slice(i, i + preambleCount);
            const element = XMAS[i + preambleCount];
            let isValid = false;

            for (let j = 0; j < preambleCount; j++) {
                const first = preamble[j];
                for (let k = j + 1; k < preambleCount; k++) {
                    const second = preamble[k];
                    if (element == first + second) {
                        isValid = true;
                        break;
                    }
                }
                if (isValid)
                    break;
            }

            if (!isValid) {
                for (let j = i + preambleCount - 1; j >= 0; j--) {
                    let sum = XMAS[j];
                    for (let k = j - 1; k >= 0; k--) {
                        sum += XMAS[k];
                        if (sum == element) {
                            const list = XMAS.slice(k, j + 1);
                            return Math.min(...list) + Math.max(...list);
                        }
                        if (sum > element)
                            break;
                    }
                }
            }
        }
    };

    const response = hack();

    console.log(response);
});
