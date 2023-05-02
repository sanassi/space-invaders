let canvas = document.getElementById('canvas')
canvas.width = 1000;
canvas.height = 700;

let ctx = canvas.getContext('2d')

let cellSize = 5;
let stepX = 20;
let stepY = 20;
let playerStepX = 20;
let playerStepY = 20;

class Entity {
    constructor(position, points) {
        this.position = position; // needs to be a list of positions
        this.points = points;
        this.h = points.length;
        this.w = points[0].length;

        this.color = '#000000';
        this.isOn = true;
    }

    draw() {
        if (!this.isOn)
            return;

        for (let i = 0; i < this.points.length; i++)
            for (let j = 0; j < this.points[i].length; j++)
                if (this.points[i][j] !== 0)
                    drawRect(this.position.x + j * cellSize, 
                        this.position.y + i * cellSize, 
                        this.color);
    }

    pointIsIn(point) {
        if (point.x < this.position.x || point.x > this.position.x + this.w * cellSize)
            return false;
        
        if (point.y < this.position.y || point.y > this.position.y + this.h * cellSize)
            return false;

        console.log('hit!');

        return true;
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

// Bitmaps
let invader1BitMap = [
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [0,0,0,1,1,0,1,1,0,0,0]];

let shipBitmap = [
    [0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1]];

let shotBitmap = [
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1]];

function init() {
    let entities = [];
    for (let i = 0; i < canvas.width / 2; i += 150) {
        let ent = new Entity({x:i, y:0}, invader1BitMap);
        entities.push(ent);
    }

    return entities;
}

let player = new Entity({x:Math.floor(canvas.width / 2), y:300}, shipBitmap);
let entities = init();
let shots = [];

function drawEntities() {
    entities.forEach((x) => x.draw());
    player.draw();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveEntities() {
    let last = entities[entities.length - 1];
    let first = entities[0];

    if (first.position.x + stepX < 0)
        stepX = -stepX;

    if (last.position.x + last.w * cellSize + stepX >= canvas.width)
        stepX = -stepX;

    for (let entity of entities) {
        entity.position.x += stepX;
    }

    drawEntities();
}

function moveShot(shot) {
    if (!shot.isOn)
        return;

    shot.position.y -= stepY;
    if (shot.position.y <= 0)
        shot.isOn = false;

    console.log('shot position: ', shot.position);
    
    shot.draw();
}

function moveShots() {
    shots.forEach((shot) => moveShot(shot));
}

function updateTargets() {
    for (let shot of shots) {
        if (!shot.isOn)
            continue;
            
        entities.forEach((alien) => {
            if (alien.pointIsIn(shot.position)) {
                alien.isOn = false;
                shot.isOn = false;
            }
        })
    }
}

function animate() {
    clear();
    moveShots();

    updateTargets();

    moveEntities();
    setTimeout(() => {
        window.requestAnimationFrame(animate);
    }, 100);
}

// Player movement
window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "ArrowLeft":
            player.position.x -= playerStepX;
            player.position.x = Math.max(0, player.position.x);
            break;

        case "ArrowRight":
            if (player.position.x + player.w * cellSize + playerStepX < canvas.width)
                player.position.x += playerStepX;
            console.log(player.position);
            break;
        
        case " ":
            let shot = new Entity({x:player.position.x + Math.floor(player.w / 2) * cellSize, 
            y:player.position.y - shotBitmap.length * cellSize}, 
            shotBitmap);
            shots.push(shot);

            shot.color = '#ff0000';

            break;

        default:
            break;
    }
});

window.addEventListener('load', () => animate());