let canvas = document.getElementById('canvas')
canvas.width = 1000;
canvas.height = 1000;

let ctx = canvas.getContext('2d')

let cellSize = 10;
let stepX = 20;
let stepY = 20;

class Entity {
    constructor(position, points) {
        this.position = position;
        this.points = points;
        this.w = points.length;
        this.h = points[0].length;
    }

    draw() {
        for (let i = 0; i < this.points.length; i++)
            for (let j = 0; j < this.points[i].length; j++)
                if (this.points[i][j] !== 0)
                    drawRect(this.position.x + j * cellSize, 
                        this.position.y + i * cellSize, 
                        '#000000');
    }
}

class Board {
    constructor(w, h, data) {
        this.w = w;
        this.h = h;
        this.data = data;
    }
}

function drawRect(x, y, color){
    ctx.fillStyle = color;
    let region = new Path2D();
    region.rect(x, y, cellSize, cellSize);
    region.closePath();
    ctx.fill(region);
}

let invader1BitMap = [
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [0,0,0,1,1,0,1,1,0,0,0]];

function init() {
    let entities = [];
    for (let i = 0; i < 500; i += 150) {
        let ent = new Entity({x:i, y:0}, invader1BitMap);
        entities.push(ent);
    }

    return entities;
}

let entities = init();

function drawEntities() {
    entities.forEach((x) => x.draw());
}

function moveEntities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let last = entities[entities.length - 1];
    let first = entities[0];

    if (first.position.x + stepX < 0)
        stepX = -stepX;

    if (last.position.x + last.w * cellSize + stepX >= canvas.width)
        stepX = -stepX;

    for (let entity of entities) {
        entity.position.x += stepX;
        console.log(entity.position);   
    }

    drawEntities();
}

function animate() {
    moveEntities();
    setTimeout(() => {
        window.requestAnimationFrame(animate);
    }, 200);
}

window.addEventListener('load', () => animate());