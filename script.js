// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore')

//Define game variables
const gridSize = 20;
let snake = [{x:10, y:10}]
let food = generateFood();
let highScore = 0;
let gameInterval;
let gameSpeedDelay = 1200;
let gameStarted = false;
let direction = 'right';

//Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement = createGameElement('div',
        'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//Draw food
function drawFood(){
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement); 
    }   
}

// Generate food
function generateFood(){
    const x =  Math.floor(Math.random() * gridSize) + 1;
    const y =  Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

//Create a snake or food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set the position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


//Moving the snake
function move(){
    const head = {...snake[0]};
    switch (direction) {
    case 'right':
        head.x++
        break;
    case 'left':
        head.x--
        break;
    case 'up':
        head.y--
        break;
    case 'down':
        head.y++
        break;
    } 
    snake.unshift(head);
   
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameInterval = setInterval(()=>{            
            move();
            draw();
        }, gameSpeedDelay); 
    } else {
         snake.pop();
    }
}

//Start game function
function startGame(){
    gameStarted = true;//Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none'
    gameInterval = setInterval(()=>{
        draw();
        checkCollision();
        move();
    }, gameSpeedDelay);
}

//Keypress event listener
function handleKeyPress(event){
    if ((!gameStarted && event.code === 'Space')||(!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction === 'down') {
                    break;
                }
                direction = 'up';
            break;
            case 'ArrowDown':
                if (direction === 'up') {
                    break;
                }
                direction = 'down';
            break;
            case 'ArrowLeft':
                if (direction === 'right') {
                    break;
                }
                direction = 'left';
            break;
            case 'ArrowRight':
                if (direction === 'left') {
                   break;
                }
                direction = 'right';
            break;           
        }
    }
}
///////
document.addEventListener('keydown', handleKeyPress);
///////

function increaseSpeed(){
    gameSpeedDelay--;
}
function checkCollision(){
    const head = snake[0];
    if(head.x<1||head.x > gridSize || head.y<1||head.y>gridSize){
        resetGame();    
    }

    for(let i = 1; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    updateScore();
}

function updateScore(){
   const currentScore = snake.length - 1;
   score.textContent = currentScore.toString().padStart(3, '0')
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        highScoreText.style.display = 'block';
    }
}