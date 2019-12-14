fs = require("fs");
fs.readFile("./2019/day_14/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const DEBUG = false;
    let res = null;

    const regex1 = /(\d+ \w+(?:, \d+ \w+)*) => (\d+) (\w+)/;
    const regex2 = /(\d+) (\w+)/;
    const nanofactory = data.split('\r\n').reduce((acc, s) => {
        const [, reac, qty, res] = s.match(regex1);
        const arr = reac.split(',').map(r => {
            const [, qty, res] = r.match(regex2);
            return {qty : Number(qty), res};
        });
        acc[res] = {qty : Number(qty), reac : arr};
        return acc;
    }, {});

    const getResources = (res, qty) => {
        const rec = (res, qty, waste) => {
            if(res == "ORE" || qty == 0) return qty;
    
            let total = 0;
            const obj = nanofactory[res];
    
            if(waste[res]) {
                const taken = Math.min(waste[res], qty);
                qty -= taken;
                waste[res] -= taken;
            }
            const subQty = Math.ceil(qty / obj.qty);
            waste[res] = (waste[res] || 0) + (subQty * obj.qty - qty);
            
            for (const subObj of obj.reac) {
                if(DEBUG) console.log(`${subObj.qty * subQty} ${subObj.res}`);
                total += rec(subObj.res, subObj.qty * subQty, waste);
            }
            
            return total;
        };
        let waste = {};
        let resources = rec(res, qty, waste);
        return resources;
    }

    res = getResources("FUEL", 1);
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
