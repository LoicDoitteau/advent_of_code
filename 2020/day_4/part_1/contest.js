fs = require("fs");
fs.readFile("./2020/day_4/input.txt", 'utf8', (err, input) => {
    
    const fieldsRequirement = {
        byr: true,
        iyr: true,
        eyr: true,
        hgt: true,
        hcl: true,
        ecl: true,
        pid: true,
        cid: false
    };
    const fields = Object.keys(fieldsRequirement);

    const checkPassport = (passport) => fields.every(field => passport[field] || !fieldsRequirement[field]);

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
