const { count } = require("console");

fs = require("fs");
fs.readFile("./2020/day_13/input.txt", 'utf8', (err, input) => {

    const datas = input.split("\r\n");
    const timestamp = Number(datas[0]);
    const busIds = datas[1].split(',').filter(id => id != 'x').map(Number);

   let departure = timestamp;
   let chosenBusId = null;

    while (true) {
        for (const busId of busIds) {
            if (departure % busId == 0) {
                chosenBusId = busId;
                break;
            }
        }
        if (chosenBusId) break;
        departure++;
    }

    const response = (departure - timestamp) * chosenBusId;
    console.log(response);
});
