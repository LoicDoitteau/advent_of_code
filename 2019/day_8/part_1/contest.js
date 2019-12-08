fs = require("fs");
fs.readFile("./2019/day_8/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const wide = 25;
    const tall = 6;
    const pixels = Array.from({length : data.length / wide}, (_, i) => data.substring(i * wide, i * wide + wide));
    const layers = Array.from({length : pixels.length / tall}, (_, i) => pixels.slice(i * tall, i * tall + tall));
    
    const getXDigitCount = x => layer => layer.reduce((acc, v) => acc + (v.split(x).length - 1), 0);
    const get0DigitCount = getXDigitCount(0);
    const get1DigitCount = getXDigitCount(1);
    const get2DigitCount = getXDigitCount(2);

    const layer = layers.sort((l1, l2) => get0DigitCount(l1) - get0DigitCount(l2))[0];
    const res = get1DigitCount(layer) * get2DigitCount(layer);

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});