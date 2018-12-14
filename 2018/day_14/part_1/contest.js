fs = require("fs");

fs.readFile("./2018/day_14/part_1/input.txt", 'utf8', (err, input) => {
    var n = Number(input);
    var first = {score : "3", index : 0};
    var second = {score : "7", index : 1};
    var recipes = [first, second];
    while(recipes.length < n + 10) {
        addRecipes(first, second, recipes);
        first = getCurrent(first, recipes);
        second = getCurrent(second, recipes);
    }
    console.log(getTenRecipesScores(n, recipes));
});

function addRecipes(r1, r2, arr) {
    var score = (Number(r1.score) + Number(r2.score)).toString();
    for(var i = 0; i < score.length; i++) {
        arr.push({score : score[i], index : arr.length});
    }
}

function getCurrent(r, arr) {
    return arr[(r.index + 1 + Number(r.score)) % arr.length];
}

function getTenRecipesScores(index, arr) {
    var scores = "";
    for(var i = 0; i < 10; i++) {
        scores += arr[index + i].score;
    }
    return scores;
}