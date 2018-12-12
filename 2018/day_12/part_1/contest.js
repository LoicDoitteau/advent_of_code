fs = require("fs");

fs.readFile("./2018/day_12/part_1/input.txt", 'utf8', (err, input) => {
    var strings = input.split("\n");
    var state = {val : strings[0].match(/initial state: (.*)/)[1], centerIndice : 0};
    var rules = strings.slice(2).reduce((acc, s) => {
        var p = /((?:\.|#)*) => (\.|#)/
        var m = s.match(p);
        acc[m[1]] = m[2];
        return acc;
    }, {});
    var g = 20;
    for(var i = 0; i < g; i++) {
        evolve(state, rules);
    }
    console.log(getScore(state));
});

function addEmpty(state) {
    var index = state.val.indexOf("#");
    var newVal = state.val;
    for(var i = 0; i < 5 - index; i++) {
        newVal = "." + newVal;
        state.centerIndice++;
    }
    for(var i = 0; i < index - 5; i++) {
        newVal = newVal.substring(1);
        state.centerIndice--;
    }
    index = state.val.lastIndexOf("#");
    for(var i = 0; i < 5 - (state.val.length - index - 1); i++) {
        newVal += ".";
    }
    for(var i = 0; i < (state.val.length - index - 1) - 5; i++) {
        newVal = newVal.substring(1);
    }
    state.val = newVal;
};

function evolve(state, rules) {
    addEmpty(state);
    var newVal = "";
    for(var i = 2; i < state.val.length - 2; i++) {
        var combo = "";
        for(var di = -2; di <= 2; di++) {
            combo += state.val[i + di];
        }
        if(rules[combo] == undefined) newVal += ".";
        else newVal += rules[combo];
    }
    newVal = ".." + newVal + "..";
    state.val = newVal;
};

function getScore(state) {
    var score = 0;
    for(var i = 0; i < state.val.length; i++) {
        if(state.val[i] == "#") score += i - state.centerIndice;
    }
    return score;
}