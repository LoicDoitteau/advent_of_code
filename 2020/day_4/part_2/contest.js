fs = require("fs");
fs.readFile("./2020/day_4/input.txt", 'utf8', (err, input) => {
    
    const fieldsRules = {
        byr: (val) => {
            if (val === undefined) return false;
            const n = Number(val);
            return !Number.isNaN(n) && 1920 <= n && n <= 2002;
        },
        iyr: (val) => {
            if (val === undefined) return false;
            const n = Number(val);
            return !Number.isNaN(n) && 2010 <= n && n <= 2020;
        },
        eyr: (val) => {
            if (val === undefined) return false;
            const n = Number(val);
            return !Number.isNaN(n) && 2020 <= n && n <= 2030;
        },
        hgt: (val) => {
            if (val === undefined) return false;
            const regex = /^(?<len>\d+)(?<unit>cm|in)$/;
            if (!regex.test(val)) return false;
            const {len, unit} = regex.exec(val).groups;
            const n = Number(len);
            if (unit == 'cm') return !Number.isNaN(n) && 150 <= n && n <= 193;
            if (unit == 'in') return !Number.isNaN(n) && 59 <= n && n <= 76;
            return false;
        },
        hcl: (val) => /^#(\d|[a-f]){6}$/.test(val),
        ecl: (val) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val),
        pid: (val) => /^\d{9}$/.test(val),
        cid: (_) => true
    };
    const fields = Object.keys(fieldsRules);

    const checkPassport = (passport) => fields.every(field => fieldsRules[field](passport[field]));

    const passports = [];
    let current = {};

    input.split("\r\n").forEach(s => {
        if (s.length == 0) {
            passports.push(current);
            current = {};
        } else {
            s.split(' ').reduce((acc, pair) => {
                const [field, value] = pair.split(':');
                acc[field] = value;
                return acc;
            }, current);
        }

    });

    const response = passports.reduce((acc, passport) => acc + checkPassport(passport), 0);

    console.log(response);
});
