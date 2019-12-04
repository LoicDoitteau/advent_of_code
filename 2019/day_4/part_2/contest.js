fs = require("fs");
fs.readFile("./2019/day_4/input.txt", 'utf8', (err, input) => {
    const startTime = new Date().getTime();
    let [min, max] = input.split('-').map(Number);
    let res = 0;

    for(let pwd = min; pwd <= max; pwd++) {
        let arrpwd = Array.from(pwd.toString());
        let arrcheck = arrpwd.slice(1);
        if(arrcheck.every((d, i) => d >= arrpwd[i])){
            let c = 0;
            for(let i = 0; i < arrcheck.length; i++) {
                if(c == 1 && arrcheck[i] != arrpwd[i]) {
                    break;
                }
                if(arrcheck[i] == arrpwd[i]) c++;
                else c = 0;
            }
            if(c == 1) res++;
        }
    }

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

