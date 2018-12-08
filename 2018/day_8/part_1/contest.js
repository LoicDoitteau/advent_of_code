fs = require("fs");
fs.readFile("./2018/day_8/part_1/input.txt", 'utf8', (err, input) => {
    var p = /\d+/g;
    var toDo = input.match(p).map(Number);
    var r = process(toDo);
    console.log(r);
});
function process(arr) {
    this.arr = arr;
    this.sum = 0;
    var rec = () => {
        var [childCount, metadataCount, ...arr] = this.arr;
        this.arr = arr;
        var node = {children : [], metadata : []};
        for (let i = 0; i < childCount; i++) {
            node.children.push(rec())
        }
        node.metadata = this.arr.splice(0,  metadataCount);
        this.sum += node.metadata.reduce((m1, m2) => m1 + m2);
        return node;
    };
    rec();
    return this.sum;
};