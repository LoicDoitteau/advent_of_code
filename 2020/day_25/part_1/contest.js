
fs = require("fs");
fs.readFile("./2020/day_25/input.txt", 'utf8', (err, input) => {
    console.time();

    const divizor = 20201227;
    const publicSubjectNumber = 7;
    const [ cardPublicKey, doorPublicKey ] = input.split('\r\n').map(Number);

    const transform = (number, subjectNumber) => (number * subjectNumber) % divizor;

    const getLoopSize = key => {
        let loopSize = 0;
        let number = 1;

        while (number != key) {
            number = transform(number, publicSubjectNumber);
            loopSize++;
        }

        return loopSize;
    }

    const cardLoopSize = getLoopSize(cardPublicKey);
    
    let encryptionKey = 1;
    for (let i = 0; i < cardLoopSize; i++) {
        encryptionKey = transform(encryptionKey, doorPublicKey);
    }

    const response = encryptionKey;
    console.log(response);
    console.timeEnd();
});
