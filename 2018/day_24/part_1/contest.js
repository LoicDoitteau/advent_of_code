fs = require("fs");

fs.readFile("./2018/day_24/part_1/input.txt", 'utf8', (err, input) => {
    var[,,immuneInput,,infectionInput] = input.split(/(Immune System|\r\n\r\nInfection):\r\n/);
    var immuneGroups = immuneInput.split("\r\n").map(s => getGroup(s, 'immune'));
    var infectionGroups = infectionInput.split("\r\n").map(s => getGroup(s, 'infection'));
    while(immuneGroups.some(group => group.units > 0) && infectionGroups.some(group => group.units > 0)) fight(immuneGroups, infectionGroups);
    var winningGroups = immuneGroups.some(group => group.units > 0) ? immuneGroups : infectionGroups;
    // [...immuneGroups, ...infectionGroups].forEach(group => console.log(group));
    console.log(winningGroups.reduce((acc, group) => acc + group.units, 0));
});

var p1 = /(\d+) units each with (\d+) hit points( \(.*\)|) with an attack that does (\d+) (bludgeoning|radiation|cold|fire|slashing) damage at initiative (\d+)/;
var p2 = /weak to ((?:bludgeoning|radiation|cold|fire|slashing)(?:, (?:bludgeoning|radiation|cold|fire|slashing))*)/;
var p3 = /immune to ((?:bludgeoning|radiation|cold|fire|slashing)(?:, (?:bludgeoning|radiation|cold|fire|slashing))*)/;

function getGroup(s, type) {
    var [, units, hitPoint, system, attackDamage, attackType, initiative] = s.match(p1);
    var m = system.match(p2);
    var weeknesses = [];
    var immunities = [];
    var m = system.match(p2);
    if(m != null) weeknesses = m[1].split(", ");
    m = system.match(p3);
    if(m != null) immunities = m[1].split(", ");
    return {type, units : Number(units), hitPoint : Number(hitPoint), weeknesses, immunities, attackDamage : Number(attackDamage), attackType, initiative : Number(initiative)};
}

function getEffectivePower(group) {
    return group.units * group.attackDamage;
}

function fight(immuneGroups, infectionGroups) {
    targetSelectionPhase(immuneGroups, infectionGroups);
    attackingPhase(immuneGroups, infectionGroups);
}

function targetSelectionPhase(immuneGroups, infectionGroups) {
    var groupsOrdered = [...immuneGroups, ...infectionGroups].sort((g1, g2) => {
        var ep1 = getEffectivePower(g1);
        var ep2 = getEffectivePower(g2);
        if(ep1 != ep2) return ep2 - ep1;
        return g2.initiative - g1.initiative;
    });
    groupsOrdered.forEach(group => {
        group.targeted = false;
        group.target = null;
    });
    groupsOrdered.forEach(attackingGroup => {
        if(attackingGroup.units > 0) {
            var effectivePower = getEffectivePower(attackingGroup);
            var defendingGroups = attackingGroup.type == "immune" ? infectionGroups : immuneGroups;
            var targets = defendingGroups.reduce((acc, defendingGroup) => {
                if(!defendingGroup.targeted && defendingGroup.units > 0) {
                    var damage = effectivePower;
                    damage *= defendingGroup.immunities.indexOf(attackingGroup.attackType) == -1 ? defendingGroup.weeknesses.indexOf(attackingGroup.attackType) == -1 ? 1 : 2 : 0;
                    if(damage > acc.damage) acc = {groups : [defendingGroup], damage};
                    else if(damage == acc.damage) acc.groups.push(defendingGroup);
                }
                return acc;
            }, {groups : [], damage : -Infinity});
            if(targets.groups.length > 0 && targets.damage > 0) {
                var target = targets.groups.sort((g1, g2) => {
                    var ep1 = getEffectivePower(g1);
                    var ep2 = getEffectivePower(g2);
                    if(ep1 != ep2) return ep2 - ep1;
                    return g2.initiative - g1.initiative;
                })[0];
                target.targeted = true;
                attackingGroup.target = target;
            }
        }
    });
}

function attackingPhase(immuneGroups, infectionGroups) {
    var groupsOrdered = [...immuneGroups, ...infectionGroups].sort((g1, g2) => g2.initiative - g1.initiative);
    groupsOrdered.forEach(group => {
        if(group.units > 0 && group.target != null) {
            var damage = getEffectivePower(group);
            damage *= group.target.immunities.indexOf(group.attackType) == -1 ? group.target.weeknesses.indexOf(group.attackType) == -1 ? 1 : 2 : 0;
            group.target.units = Math.max(0, group.target.units - Math.floor(damage / group.target.hitPoint));
        }
    });
}