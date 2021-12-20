fs = require("fs");
fs.readFile("./2021/day_20/input.txt", 'utf8', (err, input) => {
    const [algorithmInput, imageInput] = input.split('\r\n\r\n');
    const algorithm = [...algorithmInput].map(c => PIXELS[c]);
    const image = imageInput.split('\r\n').map((row) => row.split('').map((c) => PIXELS[c]));
    part1(algorithm, image);
    part2(algorithm, image);
});

const PIXELS = {"." : 0, "#" : 1};

hash = (x, y) => `${x},${y}`;

part1 = (algorithm, image) => console.log(litPixelsCount(algorithm, image, 2));
part2 = (algorithm, image) => console.log(litPixelsCount(algorithm, image, 50));

litPixelsCount = (algorithm, image, count) => {
    let pixels = new Map();
    for (let y = 0; y < image.length; y++) {
        const row = image[y];
        for (let x = 0; x < row.length; x++) {
            const value = row[x];
            pixels.set(hash(x, y), {x, y, value});
        }
    }

    const toggle = algorithm[0] == 1;
    let voidValue = 0;

    for (let i = 0; i < count; i++) {
        pixels = enhance(pixels, algorithm, voidValue);
        if (toggle) voidValue = 1 - voidValue;
    }

    return [...pixels.values()].filter(pixel => pixel.value).length;
}

output = (x, y, pixels, bounds, algorithm, voidValue) => {
    const get = (x, y) => {
        if (x < bounds.xmin || x > bounds.xmax || y < bounds.ymin || y > bounds.ymax) return voidValue;
        return pixels.get(hash(x, y)).value;
    }

    const index =
        get(x-1, y-1) << 8 |
        get(x, y-1) << 7 |
        get(x+1, y-1) << 6 |
        get(x-1, y) << 5 |
        get(x, y) << 4 |
        get(x+1, y) << 3 |
        get(x-1, y+1) << 2 |
        get(x, y+1) << 1 |
        get(x+1, y+1);

    return algorithm[index];
}

enhance = (pixels, algorithm, voidValue) => {
    const newPixels = new Map();
    const done = new Set();
    const pixelBounds = bounds(pixels);

    for (const pixel of pixels.values()) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = pixel.x + dx;
                const y = pixel.y + dy;
                const key = hash(x, y);

                if (!newPixels.has(key)) {
                    const value = output(x, y, pixels, pixelBounds, algorithm, voidValue);
                    newPixels.set(key, {x, y, value});
                    done.add(key);
                }
            }
        }
    }

    return newPixels;
}

bounds = (map) => {
    const positions = [...map.values()];
    const xmin = Math.min(...positions.map(position => position.x));
    const xmax = Math.max(...positions.map(position => position.x));
    const ymin = Math.min(...positions.map(position => position.y));
    const ymax = Math.max(...positions.map(position => position.y));
    return {xmin, xmax, ymin, ymax};
}

toString = (pixels) => {
    const positions = [...pixels.values()];
    const xmin = Math.min(...positions.map(position => position.x));
    const xmax = Math.max(...positions.map(position => position.x));
    const ymin = Math.min(...positions.map(position => position.y));
    const ymax = Math.max(...positions.map(position => position.y));

    var grid = Array.from({length : ymax - ymin + 1}, _ => Array.from({length : xmax - xmin+ 1}, _ => '.'));
    for (const {x, y, value} of positions) {
        if (value) grid[y - ymin][x - xmin] = '#';
    }

    return grid.reduce((acc, row) => acc + row.join('') + '\n', '');
}
