fs = require("fs");
fs.readFile("./2020/day_18/input.txt", 'utf8', (err, input) => {
    
    const operators = {
        ADD: '+',
        MUL: '*',
    };

    const parenthesis = {
        END: ')',
        START: '(',
    }

    const parseOperation = string => {
        const trimed = string.replace(/\s/g, '');

        if (/^\d+$/.test(trimed)) return trimed;

        let operation = {};
        let cursor = trimed.length - 1;

        while (cursor >= 0) {           
            let char = trimed[cursor];
            if (char == operators.ADD || char == operators.MUL) {
                operation.operator = char;
                operation.left = parseOperation(trimed.substring(0, cursor));
                break;
            }
            else if (char == parenthesis.END) {
                let countParenthesis = 1;
                let subString = '';
                while (countParenthesis > 0) {
                    char = trimed[--cursor];
                    if (char == parenthesis.START) countParenthesis--;
                    else if (char == parenthesis.END) countParenthesis++;
                    if (countParenthesis > 0) subString += char;
                }
                const subOperation = parseOperation(subString.split('').reverse().join(''));
                if (cursor == 0) operation = subOperation;
                else operation.right = subOperation;
                cursor--;
            }
            else {
                let number = '';
                while(/\d/.test(char)) {
                    number += char;
                    char = trimed[--cursor];
                }
                operation.right = number.split('').reverse().join('');
            };
        }

        return operation;
    }

    const resolveOperation = operation => {
        if (/^\d+$/.test(operation)) return Number(operation);

        const leftValue = resolveOperation(operation.left);
        const rightValue = resolveOperation(operation.right);

        if (operation.operator == operators.MUL)
            return leftValue * rightValue;
        else if (operation.operator == operators.ADD)
            return leftValue + rightValue;
        return NaN;
    }

    const response = input.split('\r\n').reduce((acc, line) => acc + resolveOperation(parseOperation(line)), 0);
    console.log(response);
});
