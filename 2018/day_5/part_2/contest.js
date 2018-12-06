fs = require("fs");
fs.readFile("./2018/day_5/part_2/input.txt", 'utf8', (err, input) => {
    var r = Array.from({length : 26}).map((_, i) => {
        var reg = new RegExp("(" + String.fromCharCode(0x61 + i) + "|" + String.fromCharCode(0x41 + i) + ")", "gi");
        var altInput = input.replace(reg, "");
        var newInput = altInput;
        do
        {
            altInput = newInput;
            newInput = "";
            for(var i = 0; i < altInput.length - 1; i++) {
                if(altInput.charAt(i) != altInput.charAt(i + 1) && altInput.charAt(i).toUpperCase() == altInput.charAt(i + 1).toUpperCase()) {
                    i++;
                } else {
                    newInput += altInput.charAt(i);
                }
                if(i == altInput.length - 2) {
                    newInput += altInput.charAt(i + 1);
                }
            }
        }
        while(altInput.length != newInput.length);
        return altInput;
    }).reduce((s1, s2) => {
        return s1.length < s2.length ? s1 : s2;
    }).length;
    console.log(r);
});