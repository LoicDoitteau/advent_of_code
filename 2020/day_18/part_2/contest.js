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
        let operation = string.replace(/\s/g, '');
        let cursor =  0;

        while (cursor < operation.length) {           
            let char = operation[cursor];
            if (char == operators.ADD) {
                let leftCursor = cursor - 1;
                let rightCursor = cursor + 1;

                char = operation[rightCursor];
                if (char == parenthesis.START) {
                    let countParenthesis = 1;
                    while (countParenthesis > 0) {
                        char = operation[++rightCursor];
                        if (char == parenthesis.END) countParenthesis--;
                        else if (char == parenthesis.START) countParenthesis++;
                    }
                    rightCursor++;
                }
                else {
                    while(/\d/.test(char)) {
                        char = operation[++rightCursor];
                    }
                }
                operation = operation.substring(0, rightCursor) + parenthesis.END + operation.substring(rightCursor);

                
                char = operation[leftCursor];
                if (char == parenthesis.END) {
                    let countParenthesis = 1;
                    while (countParenthesis > 0) {
                        char = operation[--leftCursor];
                        if (char == parenthesis.START) countParenthesis--;
                        else if (char == parenthesis.END) countParenthesis++;
                    }
                }
                else {
                    while(/\d/.test(char)) {
                        char = operation[--rightCursor];
                    }
                }
                operation = operation.substring(0, leftCursor) + parenthesis.START + operation.substring(leftCursor);
                cursor++;
            }
            cursor++;
        }

        return operation;
    }

    const response = input.split('\r\n').reduce((acc, line) => acc + eval(parseOperation(line)), 0);
    console.log(response);
});
