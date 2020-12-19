const { cpuUsage } = require("process");

fs = require("fs");
fs.readFile("./2020/day_19/input.txt", 'utf8', (err, input) => {
    console.time();

    const regexRules = /(?<rule>\d+): (?:(?<rules>\d+(?: \d+)*(?: \| \d+(?: \d+)*)?)|"(?<value>\w)")/;
    const data = input.split('\r\n\r\n');

    const rules = data[0].split('\r\n').reduce((acc, line) => {
        let { rule, rules, value } = regexRules.exec(line).groups;
        if (rules) rules = rules.split('|').map(list => list.trim().split(' '));
        const values = [];
        if (value) values.push(value);
        acc[rule] = { rules, values };
        return acc;
    }, {});

    rules[8] = { rules: [[42], [42, 8]], values: []};
    rules[11] = { rules: [[42, 31], [42, 11, 31]], values: [] };

    const messages = data[1].split('\r\n');

    const parseValues = (ruleId) => {
        const rule = rules[ruleId];
        if (rule.values.length) return rule.values;

        rule.values = rule.rules.flatMap(subRules => {
            let values = [];
            for (const subRule of subRules) {
                const subValues = parseValues(subRule, maxRec - 1);
                if (!values.length) values = subValues;
                else {
                    const newValues = [];
                    for (const value of values) {
                        for (const subValue of subValues) {
                            newValues.push(value + subValue);
                        }
                    }
                    values = newValues;
                }
            }
            return values;
        });

        return rule.values;
    }

    const verifyRule = ruleId => {
        const values = new Set(parseValues(ruleId));
        return message => values.has(message);
    };
    const verifyRule0 = verifyRule(0);

    const response = messages.filter(verifyRule0).length;
    console.log(response);
    console.timeEnd();
});
