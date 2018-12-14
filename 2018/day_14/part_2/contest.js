fs = require("fs");

fs.readFile("./2018/day_14/part_2/input.txt", 'utf8', (err, input) => {
    var n = input.length;
    var first = {score : "3", index : 0};
    var second = {score : "7", index : 1};
    var recipes = [first, second];
    var flag = true;
    var k = 0;
    while(recipes.length < n || flag) {
        var j = addRecipes(first, second, recipes);
        if(recipes.length > n) {
            for(var i = 0; i < j; i++) {
                if(getLastNRecipesScores(recipes.length - i, n, recipes) == input) {
                    flag = false;
                    k = i;
                }
            }
        }
        first = getCurrent(first, recipes);
        second = getCurrent(second, recipes);
    }
    console.log(recipes.length - n - k);
});

function addRecipes(r1, r2, arr) {
    var score = (Number(r1.score) + Number(r2.score)).toString();
    for(var i = 0; i < score.length; i++) {
        arr.push({score : score[i], index : arr.length});
    }
    return score.length;
}

function getCurrent(r, arr) {
    return arr[(r.index + 1 + Number(r.score)) % arr.length];
}

function getLastNRecipesScores(index, n, arr) {
    var scores = "";
    for(var i = n; i > 0; i--) {
        scores += arr[index - i].score;
    }
    return scores;
}