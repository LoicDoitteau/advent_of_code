fs = require("fs");

fs.readFile("./2018/day_13/part_1/input.txt", 'utf8', (err, input) => {
    var cartInputs = ["^", ">", "v", "<"];
    var directions = {
        "^" : {
            next : {
                path : {
                    "/" : ">",
                    "\\" : "<",
                    "|" : "^"
                },                
                left : "<",
                rigth : ">",
                dx : 0,
                dy : -1
            },
            path : "|"
        },
        ">" : {
            next : {
                path : {
                    "/" : "^",
                    "\\" : "v",
                    "-" : ">"
                },
                left : "^",
                rigth : "v",
                dx : 1,
                dy : 0
            },
            path : "-"
        },
        "v" : {
            next : {
                path : {
                    "/" : "<",
                    "\\" : ">",
                    "|" : "v"
                },
                left : ">",
                rigth : "<",
                dx : 0,
                dy : 1
            },
            path : "|"
        },
        "<" : {
            next : {
                path : {
                    "/" : "v",
                    "\\" : "^",
                    "-" : "<"
                },
                left : "v",
                rigth : "^",
                dx : -1,
                dy : 0
            },
            path : "-"
        }
    };
    var map = input.split("\n").reduce((acc1, s, y) => {
        if(acc1.track[y] == undefined) acc1.track[y] = [];
        return s.split("").reduce((acc2, c, x) => {
            if(c.charCodeAt(0) != 13) {
                if(cartInputs.includes(c)) {
                acc2.carts.push({pos : {x, y}, next : directions[c].next, state : 0});
                acc2.track[y].push(directions[c].path);
                } else {
                    acc2.track[y].push(c);
                }
            }
            return acc2;
        }, acc1);
    }, {track : [], carts : []});
    var flag = true;
    while(flag) {
        map.carts.sort((cart1, cart2) => {
            if(cart1.pos.y < cart2.pos.y) return -1;
            if(cart1.pos.y > cart2.pos.y) return 1;
            if(cart1.pos.x < cart2.pos.x) return -1;
            if(cart1.pos.x > cart2.pos.x) return 1;
            return 0;
        });
        for(var i = 0; i < map.carts.length; i++) {
            var cart = map.carts[i];
            var pos = cart.pos;
            pos.x += cart.next.dx;
            pos.y += cart.next.dy;
            if(map.track[pos.y][pos.x] == "+") {
                if(cart.state == 0) cart.next = directions[cart.next.left].next;
                else if(cart.state == 2) cart.next = directions[cart.next.rigth].next;
                cart.state = (cart.state + 1) % 3;
            } else {
                cart.next = directions[cart.next.path[map.track[pos.y][pos.x]]].next;
            }
            if(map.carts.some((cart2, j) => {
                return i != j && pos.x == cart2.pos.x && cart.pos.y == cart2.pos.y;
            })) {
                console.log(cart.pos);
                flag = false;
                break;
            }
        };
    }
});