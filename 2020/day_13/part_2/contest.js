const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_13/input.txt", 'utf8', (err, input) => {

    const datas = input.split("\r\n");
    const timestamp = Number(datas[0]);
    const busIds = datas[1].split(',').reduce((acc, id, index) => {
        if (id != 'x')
            acc.push({ id: Number(id), index });
        return acc;
    }, []);

   let departure = busIds[0].id;
   let increment = departure;
   let currentBusIndex = 1;

    while (true) {
        const bus = busIds[currentBusIndex];
        if ((departure + bus.index) % bus.id == 0) {
            currentBusIndex++;
            increment *= bus.id;
            if (currentBusIndex >= busIds.length) break;
        }
        departure += increment;
    }

    const response = departure;
    console.log(response);
});
