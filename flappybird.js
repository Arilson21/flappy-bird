//board 
let board;
let boardWidth = 360;
let boardHeight = 640;
let ctx;

//bird 
let birddWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;


let bird = {
    x: birdX,
    y: birdY,
    with: birddWidth,
    height: birdHeight,
}

//pipes
let pipesArray = [];
let pipesWidth = 64;
let pipesHeight = 512;
let pipesX = boardWidth;
let pipesY = 0 ;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pips moving
let velocityY = 0; //bird jump speed 
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth
    ctx = board.getContext("2d"); 


    //draw flappy bird
    //ctx.fillStyle = "green";
    //ctx.fillRect(bird.x, bird.y, birddWidth, birdHeight)

    //load Image
    birdImg = new Image();
    birdImg.src = "./flappybird.png"
    birdImg.onload = function() {
        ctx.drawImage(birdImg, bird.x, bird.y, bird.with, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}


function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0)
    ctx.drawImage(birdImg, bird.x, bird.y, bird.with, bird.height);

    if(bird.y > board.height) gameOver = true;

    //pipes
    for (let i = 0; i < pipesArray.length; i++){
        let pipe = pipesArray[i]
        pipe.x += velocityX;
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5
            pipe.passed = true;
        }

        if(detectColllision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes 
    while (pipesArray.length > 0 && pipesArray[0].x < -pipesWidth) {
        pipesArray.shift(); // remove first element from array
    } 

    //score 
    ctx.fillStyle = "white";
    ctx.font = "45px sans-serif";
    ctx.fillText(score, 5, 45);

    if(gameOver){
        ctx.fillText("Game Over", 5, 90);
    }
}


function placePipes() {
    if(gameOver) return;

    let randomPipeY = pipesY - pipesHeight/4 - Math.random()*(pipesHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipesX,
        y: randomPipeY,
        width: pipesWidth,
        height: pipesHeight,
        passed: false,
    }

    pipesArray. push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x: pipesX,
        y: randomPipeY + pipesHeight + openingSpace,
        width: pipesWidth,
        height: pipesHeight,
        passed: false,
    }

    pipesArray.push(bottomPipe)
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArroyUp" || e.code == "keyX"){
        //jump
        velocityY = -6;

        //reste game 
        if(gameOver){
            bird.y = birdY;
            pipesArray = [];
            score = 0; 
            gameOver = false;
        }
    }
}

function detectColllision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.with > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;

}