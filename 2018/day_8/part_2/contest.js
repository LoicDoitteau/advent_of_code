fs = require("fs");
fs.readFile("./2018/day_8/part_2/input.txt", 'utf8', (err, input) => {
    var p = /\d+/g;
    var toDo = input.match(p).map(Number);
    var tree = getTree(toDo);
    var r = getNodeValue(tree);
    console.log(r);
});
function getTree(arr) {
    this.arr = arr;
    var rec = () => {
        var [childCount, metadataCount, ...arr] = this.arr;
        this.arr = arr;
        var node = {children : [], metadata : []};
        for (let i = 0; i < childCount; i++) {
            node.children.push(rec())
        }
        node.metadata = this.arr.splice(0,  metadataCount);
        return node;
    }
    return(rec());
};

function getNodeValue(node) {
    if(node == undefined) return 0;
    if(node.children.length == 0) return node.metadata.reduce((m1, m2) => m1 + m2);
    return node.metadata.reduce((acc, m) =>  acc + getNodeValue(node.children[m-1]), 0);
}