const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const paddleHeight = 45;
const paddleWidth = 10;
const paddleSpeed = 5;
const ballSpeed = 5;
const ballSpeedIncrement = 0.2;
const winningScore = 11;
const aiHandicap = 0.12;
const fps = 60;
let upKeyPressed = false;
let downKeyPressed = false;

const player = {
  x: paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  direction: 1,
  score: 0,
};

const ai = {
  x: canvas.width - paddleWidth * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  direction: -1,
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 5,
  speed: ballSpeed,
  velocityX: 5,
  velocityY: 5,
};

function displayBackground() {
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function displayLine() {
  context.fillRect(canvas.width / 2 - 0.5, 0, 1, canvas.height);
}

function displayScore(x, y, score) {
  context.font = '80px Arial';
  context.fillText(score, x, y);
}

function displayPaddle(paddle) {
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function displayBall() {
  context.fillRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function display() {
  context.fillStyle = '#000';
  displayBackground();
  context.fillStyle = '#fff';
  displayLine();
  displayScore(canvas.width / 4, canvas.height / 4, player.score);
  displayScore(3 * (canvas.width / 4) - 35, canvas.height / 4, ai.score);
  displayPaddle(player);
  displayPaddle(ai);
  displayBall();
}

function newGame() {
  player.score = 0;
  ai.score = 0;
}

function newRound(paddle) {
  paddle.score++;

  if (paddle.score === winningScore) {
    newGame();
  }

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = ballSpeed;
  ball.velocityX *= -1;
  ball.velocityY *= -1;
}

function collisionDetection(paddle, ball) {
  paddle.top = paddle.y;
  paddle.right = paddle.x + paddle.width;
  paddle.bottom = paddle.y + paddle.height;
  paddle.left = paddle.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < paddle.right && ball.top < paddle.bottom && ball.right > paddle.left && ball.bottom > paddle.top;
}

function playerMovement() {
  if (upKeyPressed && player.y > 0) {
    player.y -= paddleSpeed;
  } else if (downKeyPressed && player.y < canvas.height - player.height) {
    player.y += paddleSpeed;
  }
}

function moveAiPaddle() {
  ai.y += (ball.y - (ai.y + ai.height / 2)) * aiHandicap;
}

function ballCollision() {
  // Top/bottom ball collision
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    ball.velocityY *= -1;
  }

  // Left/right ball collision
  if (ball.x + ball.radius >= canvas.width) {
    newRound(player);
  } else if (ball.x - ball.radius <= 0) {
    newRound(ai);
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

function paddleCollision() {
  let paddle = ball.x < canvas.width / 2 ? player : ai;

  if (collisionDetection(paddle, ball)) {
    let angle = 0;

    if (ball.y < paddle.y + paddle.height / 2) {
      angle = -Math.PI / 4; // -45deg
    } else if (ball.y > paddle.y + paddle.height / 2) {
      angle = Math.PI / 4; // 45deg
    }

    ball.velocityX = paddle.direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    ball.speed += ballSpeedIncrement;
  }
}

function update() {
  playerMovement();
  ballCollision();
  moveAiPaddle();
  paddleCollision();
  display();
}

window.addEventListener('keydown', function (e) {
  switch (e.key) {
    case 'ArrowUp':
      upKeyPressed = true;
      break;
    case 'ArrowDown':
      downKeyPressed = true;
      break;
  }
});

window.addEventListener('keyup', function (e) {
  switch (e.key) {
    case 'ArrowUp':
      upKeyPressed = false;
      break;
    case 'ArrowDown':
      downKeyPressed = false;
      break;
  }
});

setInterval(update, 1000 / fps);
