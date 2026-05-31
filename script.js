// Game Constants & variables
let inputDir = {x: 0, y: 0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2, b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())};
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main Logic
musicSound.play();
window.requestAnimationFrame(main);
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// Keyboard controls
window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1};
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":    inputDir = {x: 0, y: -1}; break;
        case "ArrowDown":  inputDir = {x: 0, y: 1};  break;
        case "ArrowLeft":  inputDir = {x: -1, y: 0}; break;
        case "ArrowRight": inputDir = {x: 1, y: 0};  break;
    }
});

// Touch swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, {passive: true});

document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    moveSound.play();
    if (absDx > absDy) {
        inputDir = dx > 0 ? {x: 1, y: 0} : {x: -1, y: 0};
    } else {
        inputDir = dy > 0 ? {x: 0, y: 1} : {x: 0, y: -1};
    }
}, {passive: true});

// On-screen button support
function setDir(x, y) {
    inputDir = {x, y};
    moveSound.play();
}
document.getElementById('btn-up').addEventListener('click',    () => setDir(0, -1));
document.getElementById('btn-down').addEventListener('click',  () => setDir(0, 1));
document.getElementById('btn-left').addEventListener('click',  () => setDir(-1, 0));
document.getElementById('btn-right').addEventListener('click', () => setDir(1, 0));