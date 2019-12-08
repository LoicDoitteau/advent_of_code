fs = require("fs");
fs.readFile("./2019/day_8/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const wide = 25;
    const tall = 6;
    const rows = Array.from({length : data.length / wide}, (_, i) => data.substring(i * wide, i * wide + wide));
    const layers = Array.from({length : rows.length / tall}, (_, i) => rows.slice(i * tall, i * tall + tall));
    
    let image = "";
    for(let col = 0; col < tall; col++) {
        for(let row = 0; row < wide; row++) {
            let imagePixel = "2";
            for (const layer of layers) {
                const pixel = layer[col][row];
                if(pixel < imagePixel) {
                    imagePixel = pixel;
                    break;
                }
            }
            image += imagePixel + ";";
        }
        image += "\r\n";
    }

    fs.writeFile("./2019/day_8/part_2/output.csv", image, function(err) {
        if(err) return console.log(err);
        console.log("The file was saved!");
    });

    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});