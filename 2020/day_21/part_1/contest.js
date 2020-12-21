fs = require("fs");
fs.readFile("./2020/day_21/input.txt", 'utf8', (err, input) => {
    console.time();
    const regex = /(?<ingredients>\w+(?: \w+)*) \(contains (?<allergens>\w+(?:, \w+)*)\)/;

    let ingredientsList = new Map();
    let allergensList = new Map();
    for (const line of input.split('\r\n')) {
        let { ingredients, allergens } = regex.exec(line).groups;
        ingredients = ingredients.split(' ');
        allergens = allergens.split(', ');
        for (const allergen of allergens) {
            if (!allergensList.has(allergen)) allergensList.set(allergen, []);
            allergensList.get(allergen).push(new Set(ingredients));
        }
        for (const ingredient of ingredients) {
            ingredientsList.set(ingredient, (ingredientsList.get(ingredient) || 0) + 1);
        }
    };

    const possibilities = new Map();
    for (const [allergen, ingredients] of allergensList) {
        if (ingredients.length == 1) possibilities.set(allergen, ingredients[0]);
        else possibilities.set(allergen, ingredients.reduce((set1, set2) => new Set([...set1].filter(x => set2.has(x)))))
    }

    const done = new Map();
    const ingredientsAllergen = new Map();
    while (done.size != possibilities.size) {
        for (const [allergen, ingredients] of possibilities) {
            if (done.has(allergen)) continue;
            if (ingredients.size == 1) {
                const ingredient = ingredients.values().next().value;
                done.set(allergen, ingredient);
                ingredientsAllergen.set(ingredient, allergen);
                for (const ingredients of possibilities.values()) {
                    ingredients.delete(ingredient);
                }
                break;
            }
        }
    }

    let response = 0;
    for (const [ingredient, count] of ingredientsList) {
        if (!ingredientsAllergen.has(ingredient)) response += count;
    };
    console.log(response);
    console.timeEnd();
});
