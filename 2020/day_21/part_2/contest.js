fs = require("fs");
fs.readFile("./2020/day_21/input.txt", 'utf8', (err, input) => {
    console.time();
    const regex = /(?<ingredients>\w+(?: \w+)*) \(contains (?<allergens>\w+(?:, \w+)*)\)/;

    let allergensList = new Map();
    for (const line of input.split('\r\n')) {
        let { ingredients, allergens } = regex.exec(line).groups;
        ingredients = ingredients.split(' ');
        allergens = allergens.split(', ');
        for (const allergen of allergens) {
            if (!allergensList.has(allergen)) allergensList.set(allergen, []);
            allergensList.get(allergen).push(new Set(ingredients));
        }
    };

    const possibilities = new Map();
    for (const [allergen, ingredients] of allergensList) {
        if (ingredients.length == 1) possibilities.set(allergen, ingredients[0]);
        else possibilities.set(allergen, ingredients.reduce((set1, set2) => new Set([...set1].filter(x => set2.has(x)))))
    }

    const allergens = new Map();
    while (allergens.size != possibilities.size) {
        for (const [allergen, ingredients] of possibilities) {
            if (allergens.has(allergen)) continue;
            if (ingredients.size == 1) {
                const ingredient = ingredients.values().next().value;
                allergens.set(allergen, ingredient);
                for (const ingredients of possibilities.values()) {
                    ingredients.delete(ingredient);
                }
                break;
            }
        }
    }

    const response = [...allergens].sort((kvp1, kvp2) => kvp1[0].localeCompare(kvp2[0])).map(kvp => kvp[1]).join(',');
    console.log(response);
    console.timeEnd();
});
