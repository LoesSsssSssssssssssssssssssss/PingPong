const canvas = document.getElementById("pong")
const ctx = canvas.getContext("2d")
let socket

// ракетка пользователя

const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

// создаем мячик

const ball = {
    x: canvas.width/2 ,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

// прямоугольник

function drawRect (x,y,w,h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}

// создаем сеть

const net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 2,   
    height: 10,
    color: "WHITE"
}

// рисуем сеть

function drawNet() {
    for(let i = 0; i < canvas.height; i+=15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

// круг

function drawCircle (x,y,r,color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x,y,r,0,Math.PI*2,false)
    ctx.closePath()
    ctx.fill()
}

// текст

function drawText (text,x,y,color) {
    ctx.fillStyle = color
    ctx.font = "45px fantasy"
    ctx.fillText(text,x,y)
}

// рисуем игру

function render(){

    drawRect(0,0, canvas.width, canvas.height, "BLACK")
    
    //сеть
    drawNet()

    // счет

    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE")
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE")

    // рисуем игрока

    drawRect(user.x, user.y, user.width, user.height, user.color)
    drawRect(com.x, com.y, com.width, com.height, com.color)

    // рисуем мячик

    drawCircle(ball.x, ball.y, ball.radius, ball.color)
}

// коллизия

function collision (b,p) {
     b.top = b.y - b.radius
     b.bottom = b.y + b.radius
     b.left = b.x - b.radius
     b.right = b.x + b.radius

     p.top = p.y
     p.bottom = p.y + p.height
     p.left = p.x
     p.right = p.x + p.width

     return b.right > p.left && p.bottom > p.top && b.left < p.right && b.top < p.bottom 
}

// управление игроком

canvas.addEventListener("mousemove", movePaddle) 

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect()

    user.y = evt.clientY - rect.top - user.height/2
}

// обновление мячика

function resetBall() {
    ball.x = canvas.width/2
    ball.y = canvas.height/2

    ball.speed = 5
    ball.velocityX = -ball.velocityX
}

// обновление всего

function update () {
    ball.x += ball.velocityX
    ball.y += ball.velocityY

    // ПОКА НЕТ КОЛИ ДЕЛАЕМ БОТА

    let computerLevel = 0.1
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY
    }

    let player = (ball.x < canvas.width/2) ? user : com
    
    if(collision(ball,player)){
        let collidePoint = ball.y - (player.y + player.height/2)
        collidePoint = collidePoint/player.height/2

        let angleRad = collidePoint * Math.PI/4

        let direction = (ball.x < canvas.width/2 ? 1 : -1)

        // Изменяем скорость X и Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)
        ball.velocityY = ball.speed * Math.sin(angleRad)
        ball.speed += 1
    }

    // счетчик

    if(ball.x - ball.radius < 0) {
        // бот вин
        com.score++
        resetBall()
    }else if(ball.x + ball.radius > canvas.width) {
        user.score++
        resetBall()
    }
}


// инициализируем игру 

function game(){
    update()
    render()
}

// loop
const framePerSecond = 50
setInterval(game, 1000/framePerSecond)