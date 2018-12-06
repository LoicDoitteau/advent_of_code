fs = require("fs");
fs.readFile("./2018/day_5/part_1/input.txt", 'utf8', (err, input) => {
    var newInput = input;
    do
    {
        input = newInput;
        newInput = "";
        for(var i = 0; i < input.length - 1; i++) {
            if(input.charAt(i) != input.charAt(i + 1) && input.charAt(i).toUpperCase() == input.charAt(i + 1).toUpperCase()) {
                i++;
            } else {
                newInput += input.charAt(i);
            }
            if(i == input.length - 2) {
                newInput += input.charAt(i + 1);
            }
        }
    }
    while(input.length != newInput.length)
    var r = input.length;
    console.log(r);
});